import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks bot ping.')
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction) {
        await interaction.deferReply();
        const action = await interaction.editReply({
            content: `Pinging...`,
            fetchReply: true,
        });

        return interaction.editReply({
            content: `Bot Latency: ${prettyMilliseconds(action.createdTimestamp - interaction.createdTimestamp)}\nAPI Latency: ${prettyMilliseconds(
                interaction.client.ws.ping,
            )}`,
        });
    },
};
