import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    CraftableItem,
    findItem,
    Ingredient,
    Modules,
    Player,
    randomEmbed,
} from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Fun,
    data: new SlashCommandBuilder()
        .setName("recipe")
        .setDescription("View the recipe of an item")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("item")
                .setDescription("The item to display the recipe for")
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
        if (!item)
            return interaction.editReply({
                content: `${itemName} is not an item.`,
            });
        const recipe = item.recipe;
        if (!recipe)
            return interaction.editReply({
                content: `${itemName} does not have a recipe.`,
            });

        const embed = randomEmbed()
            .setTitle(`${item.name}`)
            .setDescription(
                `**Ingredients:**\`\`\`${recipe
                    .getIngredients()
                    .map((ingredient) => formatIngredient(ingredient))
                    .join("\n")}\`\`\`
                    ${
                        recipe.canCraft(player.backpackContent)
                            ? "**Craftable:** ✅"
                            : `**Missing Items:**\n\`\`\`${recipe
                                  .missingItems(player.backpackContent)
                                  .map(
                                      (item) =>
                                          `${item.item.name} x ${item.amountMissing}`
                                  )
                                  .join("\n")}\`\`\``
                    }
                    **Result:** ${item.name}`
            );

        return interaction.editReply({ embeds: [embed] });
    },
};

function formatIngredient(ingredient: Ingredient, level = 0) {
    let indent = " ".repeat(level * 2);
    let result = `${indent}${ingredient.item.name} x ${ingredient.amount}`;

    if (ingredient.item instanceof CraftableItem) {
        let subIngredients = ingredient.item.recipe
            .getIngredients()
            .map((subIngredient) => formatIngredient(subIngredient, level + 1))
            .join("\n");

        result += `:\n${subIngredients}`;
    }
    return result;
}
