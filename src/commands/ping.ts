import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import prettyMilliseconds from "pretty-ms";

export default {
    devMode: false,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Checks bot ping.")
        .setDMPermission(true)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const action = await interaction.editReply({
            content: `Pinging...`,
        });

        const botLatency = prettyMilliseconds(
            action.createdTimestamp - interaction.createdTimestamp
        );
        const apiLatency = prettyMilliseconds(interaction.client.ws.ping);
        const content = `Bot Latency: ${botLatency}\nAPI Latency: ${apiLatency}`;

        return interaction.editReply({ content });
    },
};
