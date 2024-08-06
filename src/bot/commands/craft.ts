import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { CraftableItem, findItem, Modules, Player } from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Fun,
    data: new SlashCommandBuilder()
        .setName("craft")
        .setDescription("Craft an item")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("item")
                .setDescription("The item to craft")
                .setAutocomplete(true)
                .setRequired(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { options, user, client } = interaction;
        await interaction.deferReply();
        const player = await Player.get(user.id, client);
        const itemName = options.getString("item", true);
        const item = findItem(itemName) as CraftableItem;
        const recipe = item.recipe;
        if (!item || !recipe)
            return interaction.editReply({
                content: `No recipe was found for the item ${itemName}`,
            });
        if (!recipe.canCraft(player.backpackContent))
            return interaction.editReply({
                content: `You don't have the necessary resources to craft this item\n\`\`\`${recipe
                    .missingItems(player.backpackContent)
                    .map((item) => `${item.item.name} x ${item.amountMissing}`)
                    .join("\n")}\`\`\``,
            });
        if (
            player.backpack.getFreeSpace() +
                recipe
                    .getIngredients()
                    .reduce(
                        (acc, item) => acc + item.amount * item.item.size,
                        0
                    ) <
            recipe.amount * item.size
        )
            return interaction.editReply({
                content: `You don't have enough space in your backpack to craft this item!`,
            });
        const ingredients = recipe.getIngredients();
        for (const ingredient of ingredients) {
            player.removeItem(ingredient.item, ingredient.amount);
        }
        player.addItem(item, recipe.amount).save();

        return interaction.editReply({
            content: `You have crafted ${recipe.amount}x ${item.name}`,
        });
    },
};
