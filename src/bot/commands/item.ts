import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Modules, items, redEmbed, greenEmbed } from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Economy,
    data: new SlashCommandBuilder()
        .setName("item")
        .setDescription("Shows information about an item")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("item")
                .setDescription("The item you want to view")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const { options } = interaction;
        const itemName = options.getString("item", true);
        const item = Object.values(items).find(
            (item) => item.name === itemName
        );

        if (!item) {
            const embed = redEmbed().setTitle(
                `There is no item called ${itemName}`
            );

            return interaction.editReply({ embeds: [embed] });
        }

        const embed = greenEmbed()
            .setTitle(item.name)
            .addFields([
                { name: "Size", value: `${item.size}`, inline: true },
                { name: "Value", value: `$${item.value}`, inline: true },
                {
                    name: "Buyable",
                    value: `${item.buy ? "Yes" : "No"}`,
                    inline: true,
                },
                {
                    name: "Sellable",
                    value: `${item.sell ? "Yes" : "No"}`,
                    inline: true,
                },
                {
                    name: "Scavengable",
                    value: `${item.canScavenge ? "Yes" : "No"}`,
                    inline: true,
                },
                {
                    name: "Found in lootboxes",
                    value: `${item.inLootbox ? "Yes" : "No"}`,
                    inline: true,
                },
            ]);

        return interaction.editReply({ embeds: [embed] });
    },
};
