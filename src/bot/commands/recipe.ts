import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { findRecipe, Modules, Player, randomEmbed } from "../../lib/library.js";

export default {
    devMode: true,
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
        const player = await Player.get(user.id, client);
        const itemName = options.getString("item", true);
        const recipe = findRecipe(itemName);
        if (!recipe)
            return interaction.reply({
                content: `${itemName} does not have a recipe`,
            });
        const result = recipe.getResultItem();
        const embed = randomEmbed()
            .setTitle(`${result.name}`)
            .setDescription(
                `**Ingredients:**\`\`\`${recipe
                    .getIngredients()
                    .map(
                        (ingredient) =>
                            `${ingredient.item.name} x ${ingredient.amount}`
                    )
                    .join("\n")}\`\`\`
                    ${
                        recipe.canCraft(player.getBackpackContents())
                            ? "**Craftable:** ✅"
                            : `**Missing Items:**\n\`\`\`${recipe
                                  .missingItems(player.getBackpackContents())
                                  .map(
                                      (item) =>
                                          `${item.item.name} x ${item.amountMissing}`
                                  )
                                  .join("\n")}\`\`\``
                    }
                    **Result:** ${result.name}`
            );

        return interaction.reply({ embeds: [embed] });
    },
};
