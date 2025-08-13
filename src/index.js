require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActivityType, channelLink } = require('discord.js')
const { GoogleGenerativeAI } = require('@google/generative-ai');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

client.on('ready', (c) => {
    console.log(`${c.user.tag} is ready !`)
    
    setInterval(() => {
        let random = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[random]);
    }, 10000);
});

let status = [
    {
        name: "Cyber Bot",
        type: ActivityType.Streaming,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1',
    },
    {
        name: "Promotion 2027",
        type: ActivityType.Streaming,
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1',
    },
]

client.on(`messageCreate`, (message) => {
    if (message.author.bot) {
        return
    }
    if (message.content === 'hello' || message.content === 'hi' || message.content === 'coucou' || message.content === 'salut' || message.content === 'bonjour') {
        message.react('👋')
    }
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.isChatInputCommand()) {
        if (interaction.commandName === 'hey') {
            return interaction.reply('hey');
        }
        if (interaction.commandName === 'ping') {
            return interaction.reply('Pong');
        }
        if (interaction.commandName === 'add') {
            const num1 = interaction.options.getInteger('first_number');
            const num2 = interaction.options.getInteger('second_number');
            if (num1 !== null && num2 !== null) {
                return interaction.reply(`${num1 + num2}`);
            } else {
                return interaction.reply('Please provide two numbers.');
            }
        }
        // aistudio.google.com
        if (interaction.commandName === 'ask') {
            const question = interaction.options.getString('question');
            try {
                const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
                const prompt = "Answer to the question but you have to be short enough: " + question;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                let text = response.text();
                if (text.length > 2000) text = text.slice(0, 1997) + '...';
                await interaction.reply(text);
            } catch (error) {
                console.error(error);
                if (!interaction.replied) {
                    await interaction.reply({ content: "❗ Une erreur est survenue lors de la génération de la réponse. Merci de réessayer plus tard.", ephemeral: true });
                } else {
                    await interaction.followUp({ content: "❗ Une erreur est survenue lors de la génération de la réponse. Merci de réessayer plus tard.", ephemeral: true });
                }
            }
        }
        if (interaction.commandName === 'embed') {
            const embedTitle = interaction.options.getString('title');
            const embedDesc = interaction.options.getString('description');
            const embedUrl = interaction.options.getString('gifimage');
            const embed = new EmbedBuilder()
                .setTitle(embedTitle)
                .setDescription(embedDesc)
                .setColor('Random')
                .setImage(embedUrl)
                .setTimestamp();
            return interaction.reply({ embeds: [embed] });
        }
    }

    if (interaction.isButton()) {
        try {
            await interaction.deferReply({ ephemeral: true });
            const role = interaction.guild.roles.cache.get(interaction.customId);
            if (!role) {
                return interaction.editReply({
                    content: "I couldn't find this role...",
                    ephemeral: true,
                });
            }
            const hasRole = interaction.member.roles.cache.has(role.id);

            if (hasRole) {
                await interaction.member.roles.remove(role);
                return interaction.editReply({
                    content: `The role ${role.name} has been removed.`,
                    ephemeral: true,
                });
            }

            await interaction.member.roles.add(role);
            return interaction.editReply({
                content: `The role ${role.name} has been added.`,
                ephemeral: true,
            });
        } catch (error) {
            console.log(error);
        }
    }
});

process.on('unhandledRejection', async (error) => {
    console.error('An error has been detected :', error);
    if (client.readyAt) {
        const channel = await client.channels.fetch('1391784224960544789').catch(() => null); // Channel log Bot
        if (channel && channel.isTextBased()) {
            channel.send(`An error has been detected :\n\`\`\`${error}\`\`\``);
        }
    }
});

process.on('uncaughtException', async (error) => {
    console.error('An exception was detected :', error);
    if (client.readyAt) {
        const channel = await client.channels.fetch('1391784224960544789').catch(() => null);   // Channel log Bot
        if (channel && channel.isTextBased()) {
            channel.send(`An exception was detected :\n\`\`\`${error}\`\`\``);
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);