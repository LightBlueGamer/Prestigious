import { readdirSync } from 'node:fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import "dotenv/config";

const commands = [];
const commandFiles = readdirSync(join(__dirname, "commands")).filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
    const command = (await import(`../dist/commands/${file}`)).default;
    console.log(`Command ${command.data.name} has been registered.`);
    commands.push(command.data.toJSON())
}

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN!);

rest.put(Routes.applicationCommands(process.env.CLIENT_ID!), { body: commands })
	.then(() => console.log('All commands has been registered.'))
	.catch((err) => console.log(err));