require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.tag} is ready !`)
});

client.on(`messageCreate`, (message) => {
    if (message.author.bot) {
        return
    }
    if (message.content === 'hello' || message.content === 'hi' || message.content === 'coucou' || message.content === 'salut' || message.content === 'bonjour') {
        message.react('👋')
    }
});

client.on('interactionCreate', (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    
    if (interaction.commandName === 'hey') {
        interaction.reply('hey');
    } 
    if (interaction.commandName === 'ping') {
        interaction.reply('Pong');
    }
    if (interaction.commandName === 'add') {
        const num1 = interaction.options.getInteger('first_number');
        const num2 = interaction.options.getInteger('second_number');
        if (num1 !== null && num2 !== null) {
            interaction.reply(`${num1 + num2}`);
        } else {
            interaction.reply('Please provide two numbers.');
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);