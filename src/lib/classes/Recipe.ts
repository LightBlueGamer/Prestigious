import type { BackpackItem } from "./BackpackItem.js";
import { Ingredient } from "./Ingredient.js";
import { Item } from "./Item.js";
import type { RecipeResult } from "./RecipeResult.js";

/**
 * Represents a recipe that can produce an item or a recipe result.
 *
 * @class Recipe
 */
export class Recipe {
    /**
     * The item or recipe result that the recipe produces.
     *
     * @type {Item | RecipeResult}
     */
    result: Item | RecipeResult;

    /**
     * The list of ingredients required to create the recipe result.
     *
     * @type {(Ingredient | Item)[]}
     */
    ingredients: (Ingredient | Item)[];

    /**
     * Constructs a new instance of the Recipe class.
     *
     * @param {Item | RecipeResult} result - The item or recipe result that the recipe produces.
     * @param {(Ingredient | Item)[]} ingredients - The list of ingredients required to create the recipe result.
     */
    constructor(
        result: Item | RecipeResult,
        ingredients: (Ingredient | Item)[]
    ) {
        this.result = result;
        this.ingredients = ingredients;
    }

    /**
     * Retrieves the item that the recipe produces.
     * If the recipe result is an instance of RecipeResult, the item property of the result is returned.
     * Otherwise, the recipe result itself is returned.
     *
     * @returns {Item} - The item that the recipe produces.
     */
    getResultItem() {
        return this.result instanceof Item ? this.result : this.result.item;
    }

    /**
     * Retrieves the list of ingredients required to create the recipe result.
     * If an ingredient is an instance of {@link Ingredient}, its item and amount are added to the list.
     * If an ingredient is an instance of {@link Item}, it is added to the list with an assumed amount of 1.
     *
     * @returns {Ingredient[]} - The list of ingredients with their respective amounts.
     */
    getIngredients() {
        const ingredients = [];
        for (const ingredient of this.ingredients) {
            if (ingredient instanceof Ingredient) {
                ingredients.push({
                    item: ingredient.item,
                    amount: ingredient.amount,
                });
            } else if (ingredient instanceof Item) {
                ingredients.push({
                    item: ingredient,
                    amount: 1,
                });
            }
        }
        return ingredients;
    }

    /**
     * Checks if the player has the necessary ingredients to craft the recipe.
     *
     * @param {BackpackItem[]} backpackContents - The list of items currently in the player's backpack.
     *
     * @returns {boolean} - True if the player has all the required ingredients to craft the recipe; otherwise, false.
     */
    canCraft(backpackContents: BackpackItem[]): boolean {
        const requiredIngredients = this.getIngredients();
        for (const ingredient of requiredIngredients) {
            const itemInBackpack = backpackContents.find(
                (item) => item.name === ingredient.item.name
            );
            if (!itemInBackpack || itemInBackpack.amount < ingredient.amount) {
                return false;
            }
        }
        return true;
    }

    /**
     * Determines the list of items that are missing from the player's backpack to craft the recipe.
     *
     * @param {BackpackItem[]} backpackContents - The list of items currently in the player's backpack.
     *
     * @returns {Ingredient[]} - An array of objects, each representing an item
     * missing from the backpack along with the amount of that item required to craft the recipe.
     * If no items are missing, an empty array is returned.
     */
    missingItems(backpackContents: BackpackItem[]) {
        const requiredIngredients = this.getIngredients();
        const missingItems: { item: Item; amountMissing: number }[] = [];

        for (const ingredient of requiredIngredients) {
            const itemInBackpack = backpackContents.find(
                (item) => item.name === ingredient.item.name
            );
            if (!itemInBackpack || itemInBackpack.amount < ingredient.amount) {
                const amountMissing =
                    ingredient.amount - (itemInBackpack?.amount ?? 0);
                missingItems.push({ item: ingredient.item, amountMissing });
            }
        }

        return missingItems;
    }
}
