import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { commands } from '.';

const token: string = process.env.DISCORD_TOKEN!;
const clientId: string = process.env.CLIENT_ID!;
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        await rest.put(Routes.applicationCommands(clientId), { body: commands.map(command => command.data)});
    } catch (error) {
        console.error(error);
    } finally {
        console.log('Commands have been registered.');
    }
})();