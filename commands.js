const { REST, Routes } = require('discord.js')
require('dotenv').config()

const commands = [
    {
        name: "ping",
        description: "Replies with Pong!"
    },
    {
        name: "trendingsearches",
        description: "Replies with Trending Searches on coingecko!"
    },
];

const rest = new REST({version: "10"}).setToken(process.env.COINGECKO_BOT_TOKEN)

async function main() {
    try {
        const clientId = process.env.CLIENT_ID
        const guildId = process.env.GUILD_ID
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};

main()