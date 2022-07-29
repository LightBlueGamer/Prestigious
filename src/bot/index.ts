import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { AutoPoster } from 'topgg-autoposter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
});

import "dotenv/config";
import type { Command } from '../lib/structures/Command';

if(process.env.CLIENT_ID === '994973502975262980') {
    const poster = AutoPoster(process.env.TOPGG_TOKEN!, client);
    poster.on('posted', (stats) => {
        console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
    });
}

const eventFiles = readdirSync(`${__dirname}/events`).filter((x) => x.endsWith('.js'));
const commandFiles = readdirSync(`${__dirname}/commands`).filter((x) => x.endsWith('js'));

export const events = new Collection();
export const commands = new Collection<Command.Name, Command>();

(async () => {
    for (const file of commandFiles) {
        const command = (await import(`./commands/${file}`)).default;
        console.log(`Loading command ${command.data.name}.`);
        commands.set(command.data.name, command);
    }

    console.log(`All commands successfully loaded.`);
    for (const file of eventFiles) {
        const event = (await import(`./events/${file}`)).default;
        console.log(`Loading event ${event.name}.`);
        events.set(event.name, event);
        if (event.once) client.once(event.name, (...args) => event.execute(...args));
        else client.on(event.name, (...args) => event.execute(...args));
    }

    console.log(`All events successfully loaded.`);
})();

client.login(process.env.DISCORD_TOKEN);
