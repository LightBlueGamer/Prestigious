import { readdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { GatewayIntentBits, Client } from "discord.js";
import { commands } from "./lib/misc/commands";
import type { Command } from "./lib/classes/Command";
import type { Event } from "./lib/classes/Event";
import "dotenv/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
    ]
});

const commandFiles = readdirSync(join(__dirname, "commands")).filter((f) => f.endsWith(".js"));

for (const commandFile of commandFiles) {
    const command: Command = (await import(`./commands/${commandFile}`)).default;
    commands.set(command.data.name, command);
    console.log(`Command ${command.data.name} has loaded successfully.`);
};

const eventFiles = readdirSync(join(__dirname, "events")).filter((f) => f.endsWith(".js"));

for (const eventFile of eventFiles) {
    const event: Event = (await import(`./events/${eventFile}`)).default;
    if (event.once) client.once(event.name, (...args) => event.execute(...args));
    else client.on(event.name, (...args) => event.execute(...args));
    console.log(`Event ${event.name} has loaded successfully`);
}

client.login(process.env.BOT_TOKEN)
    .catch((err) => {
        console.error(err);
    });