import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    Modules,
    items,
    redEmbed,
    greenEmbed,
    calculateItemChance,
    formatNumber,
    calculateItemPityChance,
    Player,
} from "../../lib/library.js";

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
        const { options, user, client } = interaction;
        await interaction.deferReply();
        const player = await Player.get(user.id, client);
        const itemName = options.getString("item", true);
        const item = Object.values(items).find(
            (item) => item.name.toLowerCase() === itemName.toLowerCase()
        );

        if (!item) {
            const embed = redEmbed().setTitle(
                `There is no item called ${itemName}`
            );

            return interaction.editReply({ embeds: [embed] });
        }

        const embed = greenEmbed()
            .setTitle(`${item.name}`)
            .setURL(
                `https://prestigious-bot.xyz/wiki/item?item=${item.name}&user=${user.id}`
            )
            .addFields([
                { name: "Size", value: `${item.size}`, inline: true },
                { name: "Value", value: `$${item.value}`, inline: true },
                {
                    name: "Drop Chance",
                    value: `${formatNumber(calculateItemChance(item.name)!)}% (${formatNumber(calculateItemChance(item.name)! + calculateItemPityChance(item.name, player.pity)!)}% pity)`,
                    inline: true,
                },
            ]);

        return interaction.editReply({ embeds: [embed] });
    },
};
