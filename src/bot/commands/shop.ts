import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import {
    Modules,
    Player,
    items,
    greenEmbed,
    redEmbed,
} from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Economy,
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Buy or sell an item to the shop")
        .setDMPermission(false)
        .addSubcommand((sbCmd) =>
            sbCmd
                .setName("buy")
                .setDescription("Buy an item from the shop")
                .addNumberOption((option) =>
                    option
                        .setName("amount")
                        .setDescription("The amount you want to buy")
                        .setRequired(true)
                        .setMinValue(1)
                )
                .addStringOption((option) =>
                    option
                        .setName("item")
                        .setDescription("The item you want to buy")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand((sbCmd) =>
            sbCmd
                .setName("sell")
                .setDescription("Sell an item to the shop")
                .addNumberOption((option) =>
                    option
                        .setName("amount")
                        .setDescription("The amount you want to buy")
                        .setRequired(true)
                        .setMinValue(1)
                )
                .addStringOption((option) =>
                    option
                        .setName("item")
                        .setDescription("The item you want to sell")
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client, options } = interaction;
        const subCmd = options.getSubcommand(true);
        const player = await Player.get(user.id, client);
        const item = Object.values(items).find(
            (item) => item.name === options.getString("item", true)
        )!;
        const amount = options.getNumber("amount", true);
        const buyPrice = Math.ceil(item.value * 1.3 * amount);

        let embed: EmbedBuilder = greenEmbed();

        if (player.getBackpack().getFreeSpace() < item.size * amount) {
            embed = redEmbed().setTitle(
                "You don't have enough space in your backpack to buy this item!"
            );
            return interaction.reply({
                embeds: [embed],
            });
        }

        if (!item) {
            embed = redEmbed().setTitle("That item doesn't exist in the shop!");
            return interaction.reply({
                embeds: [embed],
            });
        }

        if (subCmd === "buy") {
            if (player.getBalance() < buyPrice)
                embed = redEmbed().setTitle(
                    "You don't have enough money to buy this item!"
                );
            else {
                player
                    .addItem(item, amount)
                    .removeBalance(buyPrice)
                    .addStatistic("Items bought", amount);
                embed = greenEmbed().setTitle(
                    `You bought ${amount}x ${item.name} for $${buyPrice}!`
                );
            }
        } else if (subCmd === "sell") {
            if (
                player.getBackpackContents().find((i) => i.name === item.name)!
                    .amount < amount
            )
                embed = redEmbed().setTitle(
                    "You don't have enough of that item to sell!"
                );
            else {
                player
                    .removeItem(item, amount)
                    .modifyBalance(item.value * amount)
                    .addStatistic("Items sold", amount);
                embed = greenEmbed().setTitle(
                    `You sold ${amount}x ${item.name} for $${item.value}!`
                );
            }
        }

        player.save();

        return interaction.reply({
            embeds: [embed],
        });
    },
};
