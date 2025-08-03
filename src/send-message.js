require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder, ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const roles = [
    {
        id: '1401658004184629348', // role 1
        label: 'One',
    },
    {
        id: '1401658054600036373', // role 2
        label: 'Two',
    },
    {
        id: '1401658081321943040', // role 3
        label: 'Three',
    },
]

client.once('ready', async () => {
    try {
        const channel = await client.channels.cache.get('1391784224960544789'); // bot channel
        if (!channel) return;

        const row = new ActionRowBuilder();
        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            );
        });

        await channel.send({
            content: 'Claim or remove a role below.',
            components: [row],
        });
        process.exit();
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.DISCORD_BOT_TOKEN)



