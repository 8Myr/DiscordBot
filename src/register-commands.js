require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'hey',
        description: 'Replies with hey !',
    },
    {
        name: 'embed',
        description: 'Sends an embed !',
        options: [
            {
                name: 'title',
                description: 'The Title.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'description',
                description: 'The Descrition.',
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: 'gifimage',
                description: 'Gif or Image.',
                type: ApplicationCommandOptionType.String,
                required: false,
            },

        ],
        required: true,
    },
    {
        name: 'ping',
        description: 'Replies with Pong !',
    },
    {
        name: 'add',
        description: 'Adds two numbers.',
        options: [
            {
                name: 'first_number',
                description: 'The first number.',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
            {
                name: 'second_number',
                description: 'The second number.',
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
        ],
    },

    
];

const rest = new REST({ version: '10'}).setToken(process.env.DISCORD_BOT_TOKEN);

(async () => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            { body: commands }
        );
        console.log(`Slash commands were registered successfully !`);
    } catch (error) {
        console.log(`There was an error : ${error}`);
    }
})();

