import type { BaseInteraction } from "discord.js";
import { Player } from "../lib/classes/Player";
import { commands } from "../lib/misc/commands";

export default {
	name: 'interactionCreate',
	once: false,
	async execute(interaction: BaseInteraction) {
		const { user, client } = interaction;

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
		} else if (interaction.isAutocomplete()) {
			if (interaction.commandName === "deposit") {
				const { balance } = await Player.get(user.id, client);
				const choices = [10, 25, 50, 75, 90, 100].map(num => {
					return { name: `${num}% - $${getPercent(balance, num)}`, value: getPercent(balance, num) }
				});

				return await interaction.respond(
					choices.map(({ name, value }) => ({ name, value })),
				);
			} else if (interaction.commandName === "withdraw") {
				const { bank } = await Player.get(user.id, client);
				const choices = [10, 25, 50, 75, 90, 100].map(num => {
					return { name: `${num}% - $${getPercent(bank, num)}`, value: getPercent(bank, num) }
				});

				return await interaction.respond(
					choices.map(({ name, value }) => ({ name, value })),
				);
			}
		}
	},
};

function getPercent(amount: number, percent: number) {
	return Math.round(amount * (percent / 100));
};