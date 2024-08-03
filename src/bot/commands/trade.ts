import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ChatInputCommandInteraction,
    ComponentType,
    ModalBuilder,
    SlashCommandBuilder,
    TextInputBuilder,
    TextInputStyle,
    type ModalActionRowComponentBuilder,
} from "discord.js";
import {
    adjustQuantities,
    extractAndSumNumbersAndText,
    generateTradeAccCanButtons,
    generateTradeButtons,
    generateTradeEmbed,
    items,
    Modules,
    Player,
} from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Fun,
    data: new SlashCommandBuilder()
        .setName("trade")
        .setDescription("Trade with another user")
        .setDMPermission(false)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user you want to trade with")
                .setRequired(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { user, options, client } = interaction;
        const player = await Player.get(user.id, client);
        const target = options.getUser("user", true);
        if (target.id === user.id)
            return interaction.editReply({
                content: `You can't trade with yourself!`,
            });

        if (target.bot)
            return interaction.editReply({
                content: `You can't trade with a bot!`,
            });
        const oPlayer = await Player.get(target.id, client);
        const trade: TradeObject = {
            p1: {
                name: user.username,
                money: 0,
                items: [],
                accepted: false,
            },
            p2: {
                name: target.username,
                money: 0,
                items: [],
                accepted: false,
            },
        };
        const askTrade = new ActionRowBuilder<ButtonBuilder>().addComponents(
            new ButtonBuilder()
                .setCustomId("accept")
                .setStyle(ButtonStyle.Success)
                .setLabel("Accept Trade"),
            new ButtonBuilder()
                .setCustomId("decline")
                .setStyle(ButtonStyle.Danger)
                .setLabel("Decline Trade")
        );
        const offerMsg = await interaction.channel!.send({
            content: `${target}, ${user} wants to trade with you. Do you accept?`,
            components: [askTrade],
        });

        const tradeOffer = offerMsg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            filter: (i) => i.user.id === target.id,
            time: 60_000,
            max: 1,
        });

        tradeOffer.on("collect", async (i) => {
            let tradeMsg;
            if (i.customId === "accept") {
                await i.deferReply();

                tradeMsg = await i.followUp({
                    content: "",
                    components: [
                        generateTradeButtons(),
                        generateTradeAccCanButtons(),
                    ],
                    embeds: [generateTradeEmbed(trade)],
                });

                tradeOffer.stop();

                const tradeEdit = tradeMsg.createMessageComponentCollector({
                    filter: (int) => [user.id, target.id].includes(int.user.id),
                    componentType: ComponentType.Button,
                    time: 3_600_000,
                });

                tradeEdit.on("collect", async (int) => {
                    switch (int.customId) {
                        case "set_money": {
                            const input = new ModalBuilder()
                                .setCustomId("money_amount")
                                .setTitle("Amount of money to trade")
                                .addComponents(
                                    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                                        new TextInputBuilder()
                                            .setCustomId("amount")
                                            .setLabel("Amount to add")
                                            .setStyle(TextInputStyle.Short)
                                            .setRequired(true)
                                            .setPlaceholder("100")
                                    )
                                );

                            await int.showModal(input);
                            const modalSubmit = await int.awaitModalSubmit({
                                filter: (m) => m.customId === "money_amount",
                                time: 3_600_000,
                            });
                            const amount = Math.floor(
                                parseInt(
                                    modalSubmit.fields.getTextInputValue(
                                        "amount"
                                    )
                                )
                            );
                            if (modalSubmit.user.id === user.id) {
                                if (amount > player.data.balance)
                                    return modalSubmit.reply({
                                        content: `You can't trade $${amount} you only have ${player.data.balance}`,
                                        ephemeral: true,
                                    });
                                if (amount < 0)
                                    return modalSubmit.reply({
                                        content: `You must trade a minimum of $1`,
                                        ephemeral: true,
                                    });
                                trade.p1.money = amount;
                            } else if (modalSubmit.user.id === target.id) {
                                if (amount > oPlayer.data.balance)
                                    return modalSubmit.reply({
                                        content: `${target}, you can't trade $${amount} you only have ${oPlayer.data.balance}`,
                                        ephemeral: true,
                                    });
                                if (amount < 0)
                                    return modalSubmit.reply({
                                        content: `${target}, you must trade a minimum of $1`,
                                        ephemeral: true,
                                    });
                                trade.p2.money = amount;
                            }

                            await modalSubmit.reply({
                                content: `You have added $${amount} to the trade.`,
                                ephemeral: true,
                            });

                            trade.p1.accepted = false;
                            trade.p2.accepted = false;

                            await i.editReply({
                                embeds: [generateTradeEmbed(trade)],
                            });
                            break;
                        }

                        case "add_item": {
                            const input = new ModalBuilder()
                                .setCustomId("items_input")
                                .setTitle("Items to trade")
                                .addComponents(
                                    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                                        new TextInputBuilder()
                                            .setCustomId("items")
                                            .setLabel("Items to add")
                                            .setStyle(TextInputStyle.Paragraph)
                                            .setRequired(true)
                                            .setPlaceholder(
                                                "Add items to trade. Specify quantity with a number. Use commas or line breaks to separate items."
                                            )
                                    )
                                );

                            await int.showModal(input);
                            const modalSubmit = await int.awaitModalSubmit({
                                filter: (m) => m.customId === "items_input",
                                time: 3_600_000,
                            });

                            const items: TradeItem[] = modalSubmit.fields
                                .getTextInputValue("items")
                                .replace(/,/gim, "\n")
                                .split("\n")
                                .map(extractAndSumNumbersAndText)
                                .map((itm) => {
                                    const { sum, text } = itm;
                                    if (sum <= 0) return null;

                                    if (modalSubmit.user.id === user.id) {
                                        const item = player
                                            .getBackpackContents()
                                            .find(
                                                (itemSearch) =>
                                                    itemSearch.name.toLowerCase() ===
                                                    text.toLowerCase()
                                            );
                                        if (!item) return null;
                                        if (sum > item.amount)
                                            return {
                                                name: text,
                                                quantity: item.amount,
                                            };
                                        return {
                                            name: text,
                                            quantity: sum,
                                        };
                                    } else if (
                                        modalSubmit.user.id === target.id
                                    ) {
                                        const item = oPlayer
                                            .getBackpackContents()
                                            .find(
                                                (itemSearch) =>
                                                    itemSearch.name.toLowerCase() ===
                                                    text.toLowerCase()
                                            );
                                        if (!item) return null;
                                        if (sum > item.amount)
                                            return {
                                                name: text,
                                                quantity: item.amount,
                                            };
                                        return {
                                            name: text,
                                            quantity: sum,
                                        };
                                    }
                                    return null;
                                })
                                .filter((itm) => itm !== null)
                                .reduce((acc: TradeItem[], item) => {
                                    if (item) {
                                        let existing = acc.find(
                                            (i) =>
                                                i.name.toLowerCase() ===
                                                item.name.toLowerCase()
                                        );
                                        if (existing) {
                                            existing.quantity += item.quantity;
                                        } else {
                                            acc.push(item);
                                        }
                                    }
                                    return acc;
                                }, []);

                            const targetItems =
                                modalSubmit.user.id === user.id
                                    ? trade.p1.items
                                    : trade.p2.items;

                            items.forEach((newItem) => {
                                let existingItem = targetItems.find(
                                    (item) =>
                                        item.name.toLowerCase() ===
                                        newItem.name.toLowerCase()
                                );

                                if (existingItem) {
                                    const playerItem =
                                        modalSubmit.user.id === user.id
                                            ? player
                                                  .getBackpackContents()
                                                  .find(
                                                      (item) =>
                                                          item.name.toLowerCase() ===
                                                          newItem.name.toLowerCase()
                                                  )
                                            : oPlayer
                                                  .getBackpackContents()
                                                  .find(
                                                      (item) =>
                                                          item.name.toLowerCase() ===
                                                          newItem.name.toLowerCase()
                                                  );
                                    if (playerItem) {
                                        const availableQuantity =
                                            playerItem.amount -
                                            existingItem.quantity;
                                        const maxQuantity = Math.min(
                                            newItem.quantity,
                                            availableQuantity
                                        );
                                        if (maxQuantity > 0) {
                                            existingItem.quantity +=
                                                maxQuantity;
                                        }
                                    }
                                } else {
                                    const playerItem =
                                        modalSubmit.user.id === user.id
                                            ? player
                                                  .getBackpackContents()
                                                  .find(
                                                      (item) =>
                                                          item.name.toLowerCase() ===
                                                          newItem.name.toLowerCase()
                                                  )
                                            : oPlayer
                                                  .getBackpackContents()
                                                  .find(
                                                      (item) =>
                                                          item.name.toLowerCase() ===
                                                          newItem.name.toLowerCase()
                                                  );
                                    if (playerItem) {
                                        const maxQuantity = Math.min(
                                            newItem.quantity,
                                            playerItem.amount
                                        );
                                        if (maxQuantity > 0) {
                                            targetItems.push({
                                                name: newItem.name,
                                                quantity: maxQuantity,
                                            });
                                        }
                                    }
                                }
                            });

                            await modalSubmit.reply({
                                content: `You have added ${items.length} items to the trade. If some items you added do not show up, it probably means you don't have that item in your backpack.`,
                                ephemeral: true,
                            });

                            trade.p1.accepted = false;
                            trade.p2.accepted = false;

                            await i.editReply({
                                embeds: [generateTradeEmbed(trade)],
                            });

                            break;
                        }

                        case "remove_item": {
                            const input = new ModalBuilder()
                                .setCustomId("items_input")
                                .setTitle("Items to remove")
                                .addComponents(
                                    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                                        new TextInputBuilder()
                                            .setCustomId("items")
                                            .setLabel("Items to remove")
                                            .setStyle(TextInputStyle.Paragraph)
                                            .setRequired(true)
                                            .setPlaceholder(
                                                "Remove items to trade. Specify quantity with a number. Use commas or line breaks to separate items."
                                            )
                                    )
                                );

                            await int.showModal(input);
                            const modalSubmit = await int.awaitModalSubmit({
                                filter: (m) => m.customId === "items_input",
                                time: 3_600_000,
                            });

                            const items: TradeItem[] = modalSubmit.fields
                                .getTextInputValue("items")
                                .replace(/,/gim, "\n")
                                .split("\n")
                                .map(extractAndSumNumbersAndText)
                                .map((itm) => {
                                    const { sum, text } = itm;
                                    if (modalSubmit.user.id === user.id) {
                                        const item = player
                                            .getBackpackContents()
                                            .find(
                                                (itemSearch) =>
                                                    itemSearch.name.toLowerCase() ===
                                                    text.toLowerCase()
                                            );
                                        if (!item) return null;
                                        if (sum > item.amount)
                                            return {
                                                name: text,
                                                quantity: item.amount,
                                            };
                                        if (sum < 0)
                                            return { name: text, quantity: 1 };
                                        else
                                            return {
                                                name: text,
                                                quantity: sum,
                                            };
                                    } else if (
                                        modalSubmit.user.id === target.id
                                    ) {
                                        const item = oPlayer
                                            .getBackpackContents()
                                            .find(
                                                (itemSearch) =>
                                                    itemSearch.name.toLowerCase() ===
                                                    text.toLowerCase()
                                            );
                                        if (!item) return null;
                                        if (sum > item.amount)
                                            return {
                                                name: text,
                                                quantity: item.amount,
                                            };
                                        if (sum < 0)
                                            return { name: text, quantity: 1 };
                                        else
                                            return {
                                                name: text,
                                                quantity: sum,
                                            };
                                    }
                                    return null;
                                })
                                .filter((itm) => itm !== null)
                                .reduce((acc: TradeItem[], item) => {
                                    let existing = acc.find(
                                        (i) =>
                                            i.name.toLowerCase() ===
                                            item.name.toLowerCase()
                                    );
                                    if (existing) {
                                        existing.quantity += item.quantity;
                                    } else {
                                        acc.push(item);
                                    }
                                    return acc;
                                }, []);

                            if (modalSubmit.user.id === user.id)
                                trade.p1.items = adjustQuantities(
                                    items,
                                    trade.p1.items
                                );
                            else if (modalSubmit.user.id === target.id)
                                trade.p2.items = adjustQuantities(
                                    items,
                                    trade.p2.items
                                );

                            await modalSubmit.reply({
                                content: `You have removed items from the trade successfully!`,
                                ephemeral: true,
                            });

                            trade.p1.accepted = false;
                            trade.p2.accepted = false;

                            await i.editReply({
                                embeds: [generateTradeEmbed(trade)],
                            });

                            break;
                        }

                        case "accept_trade": {
                            if (int.user.id === user.id)
                                trade.p1.accepted = true;
                            if (int.user.id === target.id)
                                trade.p2.accepted = true;

                            await int.reply({
                                content: `You have accepted the trade, when both parties have accepted the trade will proceed.`,
                                ephemeral: true,
                            });

                            await i.editReply({
                                embeds: [generateTradeEmbed(trade)],
                            });

                            if (trade.p1.accepted && trade.p2.accepted) {
                                completeTrade(trade);
                                i.editReply({
                                    content: `${user}, ${target} the trade was completed successfully!`,
                                    components: [],
                                    embeds: [],
                                });
                                tradeEdit.stop();
                            }

                            break;
                        }

                        case "cancel_trade": {
                            const input = new ModalBuilder()
                                .setCustomId("confirmation")
                                .setTitle("Trade cancellation")
                                .addComponents(
                                    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                                        new TextInputBuilder()
                                            .setCustomId("confirm")
                                            .setLabel(
                                                'Type "confirm" below to cancel trade'
                                            )
                                            .setStyle(TextInputStyle.Short)
                                            .setRequired(true)
                                    )
                                );

                            await int.showModal(input);
                            const modalSubmit = await int.awaitModalSubmit({
                                filter: (m) => m.customId === "confirmation",
                                time: 3_600_000,
                            });

                            if (
                                modalSubmit.fields
                                    .getTextInputValue("confirm")
                                    .toLowerCase() === "confirm"
                            ) {
                                modalSubmit.reply({
                                    content: `You have cancelled the trade.`,
                                    ephemeral: true,
                                });
                                i.editReply({
                                    content: `${modalSubmit.user.username} cancelled the trade.`,
                                    components: [],
                                    embeds: [],
                                });
                                tradeEdit.stop();
                            } else
                                modalSubmit.reply({
                                    content: `Trade cancelation was cancelled.`,
                                    ephemeral: true,
                                });

                            break;
                        }

                        default:
                            const input = new ModalBuilder()
                                .setCustomId("confirmation")
                                .setTitle("Trade cancellation")
                                .addComponents(
                                    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                                        new TextInputBuilder()
                                            .setCustomId("confirm")
                                            .setLabel(
                                                'Type "confirm" below to cancel trade'
                                            )
                                            .setStyle(TextInputStyle.Short)
                                            .setRequired(true)
                                    )
                                );

                            await int.showModal(input);
                            const modalSubmit = await int.awaitModalSubmit({
                                filter: (m) => m.customId === "confirmation",
                                time: 3_600_000,
                            });

                            if (
                                modalSubmit.fields
                                    .getTextInputValue("confirm")
                                    .toLowerCase() === "confirm"
                            ) {
                                modalSubmit.reply({
                                    content: `You have cancelled the trade.`,
                                    ephemeral: true,
                                });
                                i.editReply({
                                    content: `${modalSubmit.user.username} cancelled the trade.`,
                                    components: [],
                                    embeds: [],
                                });
                                tradeEdit.stop();
                            } else
                                modalSubmit.reply({
                                    content: `Trade cancelation was cancelled.`,
                                    ephemeral: true,
                                });
                            break;
                    }
                    return;
                });
            } else {
                await i.reply({
                    components: [],
                    content: `${user}, ${target} has declined your offer to trade.`,
                });

                tradeOffer.stop();
            }

            await offerMsg.delete();
        });

        function completeTrade(trade: TradeObject) {
            const { p1, p2 } = trade;
            const amountP1 = p1.items.reduce(
                (acc, item) => acc + item.quantity,
                0
            );
            const amountP2 = p2.items.reduce(
                (acc, item) => acc + item.quantity,
                0
            );

            if (player.getBackpack().getFreeSpace() + amountP1 < amountP2)
                return interaction.editReply({
                    content: `${user} does not have enough free space in their backpack to trade all items.`,
                });

            if (oPlayer.getBackpack().getFreeSpace() + amountP2 < amountP1)
                return interaction.editReply({
                    content: `${target} does not have enough free space in their backpack to trade all items.`,
                });

            const itemList = Object.values(items);

            for (const { name, quantity } of p1.items) {
                const item = itemList.find(
                    (itm) => itm.name.toLowerCase() === name.toLowerCase()
                )!;
                player.removeItem(item, quantity);
                oPlayer.addItem(item, quantity);
            }

            for (const { name, quantity } of p2.items) {
                const item = itemList.find(
                    (itm) => itm.name.toLowerCase() === name.toLowerCase()
                )!;
                oPlayer.removeItem(item, quantity);
                player.addItem(item, quantity);
            }

            player.removeBalance(p1.money).modifyBalance(p2.money).save();
            oPlayer.removeBalance(p2.money).modifyBalance(p1.money).save();
            return;
        }

        return;
    },
};
