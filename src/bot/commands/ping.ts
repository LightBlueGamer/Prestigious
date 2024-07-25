import {
    ChatInputCommandInteraction,
    PermissionFlagsBits,
    SlashCommandBuilder,
} from "discord.js";
import prettyMilliseconds from "pretty-ms";
import {
    greenEmbed,
    Modules,
    orangeEmbed,
    redEmbed,
} from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Information,
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Checks bot ping. ")
        .setDMPermission(true)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const action = await interaction.reply({
            content: `Pinging...`,
        });

        const botLatency = prettyMilliseconds(
            action.createdTimestamp - interaction.createdTimestamp
        );
        const apiLatency = prettyMilliseconds(interaction.client.ws.ping);
        let embed;
        if (Number(botLatency) < 150 && Number(apiLatency) < 150)
            embed = greenEmbed();
        else if (
            (Number(botLatency) < 150 && Number(apiLatency) > 150) ||
            (Number(botLatency) > 150 && Number(apiLatency) < 150)
        )
            embed = orangeEmbed();
        else embed = redEmbed();

        embed.setTitle("Pong!").setFields([
            { name: "Bot Latency", value: botLatency, inline: true },
            { name: "API Latency", value: apiLatency, inline: true },
        ]);

        return interaction.editReply({ embeds: [embed] });
    },
};
