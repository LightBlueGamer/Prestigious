import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { findRecipe, Modules, Player } from "../../lib/library.js";

export default {
    devMode: true,
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
        const player = await Player.get(user.id, client);
        const itemName = options.getString("item", true);
        const recipe = findRecipe(itemName);
        if (!recipe)
            return interaction.reply({
                content: `No recipe was found for the item ${itemName}`,
            });
        if (!recipe.canCraft(player.getBackpackContents()))
            return interaction.reply({
                content: `You don't have the necessary resources to craft this item\n\`\`\`${recipe
                    .missingItems(player.getBackpackContents())
                    .map((item) => `${item.item.name} x ${item.amountMissing}`)
                    .join("\n")}\`\`\``,
            });
        if (
            player.getBackpack().getFreeSpace() -
                recipe
                    .getIngredients()
                    .reduce((acc, item) => acc + item.amount, 0) <
            recipe.getResultAmount()
        )
            return interaction.reply({
                content: `You don't have enough space in your backpack to craft this item!`,
            });
        const ingredients = recipe.getIngredients();
        for (const ingredient of ingredients) {
            player.removeItem(ingredient.item, ingredient.amount);
        }
        player.addItem(recipe.getResultItem(), recipe.getResultAmount()).save();

        return interaction.reply({
            content: `You have crafted ${recipe.getResultAmount()}x ${recipe.getResultItem().name}`,
        });
    },
};