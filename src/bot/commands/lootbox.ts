import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    Modules,
    Player,
    Lootbox,
    redEmbed,
    greenEmbed,
    summarizeItems,
    lootboxes,
    items,
} from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Economy,
    data: new SlashCommandBuilder()
        .setName("lootbox")
        .setDescription("Open a lootbox.")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("lootbox")
                .setDescription("The lootbox you want to open.")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { options, user, client } = interaction;
        await interaction.deferReply();
        const lootboxName = options.getString("lootbox", true)!;
        const player = await Player.get(user.id, client);
        const lootbox: Lootbox | undefined = Object.values(lootboxes).find(
            (box) =>
                box.name ===
                player.backpackContent.find((box) => box.name === lootboxName)
                    ?.name
        );

        if (!lootbox) {
            const embed = redEmbed().setTitle(
                `You don't have a ${lootboxName}!`
            );

            return interaction.editReply({
                embeds: [embed],
            });
        }

        const item = Object.values(items).find(
            (i) => i.name.toLowerCase() === lootbox.name.toLowerCase()
        )!;

        if (
            player.backpack.getFreeSpace() < 0 ||
            player.excessItems.length > 0
        ) {
            const embed = redEmbed().setTitle(
                `Your backpack is full, you cannot open the lootbox until you get more space!`
            );

            return interaction.editReply({
                embeds: [embed],
            });
        }

        const itms = lootbox.openMany();

        for (const item of itms) {
            if (player.backpack.getFreeSpace() < item.size) {
                player.addExcessItem(item);
            } else {
                player.addItem(item);
            }
        }

        player.removeItem(item).addStatistic("Lootboxes opened").save();

        const embed = greenEmbed()
            .setTitle(`You opened a ${lootbox.name} lootbox!`)
            .setDescription(
                itms.length <= 1
                    ? `You got a ${items[0].name}!`
                    : `You got:\n${summarizeItems(itms)
                          .map(({ item, amount }) => `${amount}x ${item.name}`)
                          .join(
                              "\n"
                          )}${player.excessItems.length > 0 ? `\nYour backpack is full please remove items to add the remaining ${player.excessItems.length} items to your backpack!` : ""}`
            );

        return interaction.editReply({
            embeds: [embed],
        });
    },
};
