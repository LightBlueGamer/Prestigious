import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import prettyMilliseconds from "pretty-ms";
import { Modules } from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Information,
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
        const content = `Bot Latency: ${botLatency}\nAPI Latency: ${apiLatency}\n - If it returns "-1" please ignore and re-run the command`;

        return interaction.editReply({ content });
    },
};
