import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    attributeBar,
    Modules,
    Player,
    randomEmbed,
} from "../../lib/library.js";

export default {
    devMode: true,
    module: Modules.Fun,
    data: new SlashCommandBuilder()
        .setName("attributes")
        .setDescription("Shows your current attributes")
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client } = interaction;
        const player = await Player.get(user.id, client);
        const attributes = player.getAttributes();

        const embed = randomEmbed()
            .setTitle(`${user.username}'s attributes`)
            .setDescription(
                "\u200b" +
                    attributes
                        .map(
                            (atr) => `${atr.name}:\n${attributeBar(atr.value)}`
                        )
                        .join("\n\n")
            );

        interaction.reply({ embeds: [embed] });
    },
};
