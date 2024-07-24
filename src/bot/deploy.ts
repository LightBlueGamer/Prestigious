import { Collection, REST, Routes } from "discord.js";
import { commandFiles } from "../index.js";
import type { Command } from "../lib/bot/Command.js";

const token = process.env.DISCORD_TOKEN!;
const clientId = process.env.CLIENT_ID!;
const guildId = process.env.SERVER_ID!;
const rest = new REST({ version: "10" }).setToken(token);
const commands = new Collection<Command.Data.Name, Command>();
const devCommands = new Collection<Command.Data.Name, Command>();

for (const file of commandFiles) {
    const command: Command = (await import(`./commands/${file}`)).default;
    if (command.devMode) {
        devCommands.set(command.data.name, command);
    } else commands.set(command.data.name, command);
}

(async () => {
    try {
        await rest.put(Routes.applicationCommands(clientId), {
            body: commands.map((command) => command.data),
        });
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: devCommands.map((command) => command.data),
        });
        await rest.put(
            Routes.applicationGuildCommands(clientId, "1154158504614056016"),
            {
                body: devCommands.map((command) => command.data),
            }
        );
    } catch (error) {
        console.error(error);
    } finally {
        console.log("Commands have been registered.");
    }
})();
