import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import ms from 'pretty-ms';

export default {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Checks latency.')
		.setDMPermission(false),
	async execute(interaction: ChatInputCommandInteraction) {
		await interaction.deferReply();

		const message = await interaction.editReply({
			content: 'Pinging...'
		});

		const embed = new EmbedBuilder()
			.addFields([
				{ name: 'Bot Latency', value: ms(message.createdTimestamp - interaction.createdTimestamp), inline: true },
				{ name: 'API Latency', value: ms(interaction.client.ws.ping), inline: true },
			])
			.setColor("Random")
			.setFooter({ text: `Requested by ${interaction.user.username}` })

		interaction.editReply({
			embeds: [embed]
		});
	},
};