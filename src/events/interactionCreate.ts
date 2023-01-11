import type { BaseInteraction } from "discord.js";
import { commands } from "../lib/misc/commands.js";

export default {
	name: 'interactionCreate',
	once: false,
	async execute(interaction: BaseInteraction) {

		if (interaction.isChatInputCommand()) {
			const command = commands.get(interaction.commandName);
			if (!command) return;

			try {
				command.execute(interaction);
			} catch (error) {
				return console.error(error);
			} finally {
				console.log(`Command ${interaction.commandName} was received.`);
			}
		};
	},
};