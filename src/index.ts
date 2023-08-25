import { Client, GatewayIntentBits, Collection } from "discord.js";
import { readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import type { Command } from "./lib/bot/Command.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ],
});

import "dotenv/config";
import { log } from "./utils/logger.js";
import { startDB } from "./db/index.js";

const eventFiles = readdirSync(`${__dirname}/events`).filter((x) =>
    x.endsWith(".js")
);
export const commandFiles = readdirSync(`${__dirname}/commands`).filter((x) =>
    x.endsWith(".js")
);
export const events = new Collection();
export const commands = new Collection<Command.Data.Name, Command>();

(async () => {
    await startDB();

    for (const file of commandFiles) {
        const command = (await import(`./commands/${file}`)).default;
        log(`Loading command ${command.data.name}.`);
        commands.set(command.data.name, command);
    }

    log(`All commands successfully loaded.`);

    for (const file of eventFiles) {
        const event = (await import(`./events/${file}`)).default;
        log(`Loading event ${event.name}.`);
        events.set(event.name, event);
        if (event.once)
            client.once(event.name, (...args) => event.execute(...args));
        else client.on(event.name, (...args) => event.execute(...args));
    }

    log(`All events successfully loaded.`);
})();

client.login(process.env.DISCORD_TOKEN);
