import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { Collection } from 'discord.js';
import { commandFiles } from '.';

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const rest = new REST({ version: '10' }).setToken(token);
const commands = new Collection();

for (const file of commandFiles) {
    const command = (await import(`./commands/${file}`)).default;
    commands.set(command.data.name, command);
}

(async () => {
    try {
        await rest.put(Routes.applicationCommands(clientId), { body: commands.map(command => command.data)});
    } catch (error) {
        console.error(error);
    } finally {
        console.log('Commands have been registered.');
    }
})();