import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import prettyMilliseconds from 'pretty-ms';

export default {
    devCmd: false,
    permLevel: 0,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks bot ping.')
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const action = await interaction.reply({
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
