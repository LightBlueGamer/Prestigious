import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import ms from 'pretty-ms';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Checks latency.')
		.setDMPermission(true),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const message = await interaction.editReply({
			content: 'Pinging...'
		});

		interaction.editReply({
			content: `Bot Latency: ${ms(message.createdTimestamp - interaction.createdTimestamp)}\nAPI Latency: ${ms(interaction.client.ws.ping)}`
		});
	},
};