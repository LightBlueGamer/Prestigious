import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import prettyMilliseconds from "pretty-ms";

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks latency.')
        .setDMPermission(true),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        interaction.editReply({
            content: `Pinging...`
        })
            .then(msg => {
                const embed = new EmbedBuilder()
                    .addFields([
                        { name: `Bot Latency`, value: `${prettyMilliseconds(msg.createdTimestamp - interaction.createdTimestamp)}`, inline: true },
                        { name: `API Latency`, value: `${prettyMilliseconds(interaction.client.ws.ping)}`, inline: true }
                    ])
                    .setColor("Random");

                interaction.editReply({
                    embeds: [embed]
                });
            });
    }
}