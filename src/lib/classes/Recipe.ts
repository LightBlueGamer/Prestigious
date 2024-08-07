import type { BackpackItemType } from "../types/types.js";
import { Ingredient } from "./Ingredient.js";
import { Item } from "./Item.js";

/**
 * Represents a recipe that can be crafted using ingredients.
 */
export class Recipe {
    ingredients: (Ingredient | Item)[];
    amount: number;

    /**
     * Constructs a new Recipe instance.
     *
     * @param ingredients - The list of ingredients required to craft the recipe.
     * @param amount - The amount of the recipe to create (default is 1).
     */
    constructor(ingredients: (Ingredient | Item)[], amount: number = 1) {
        this.ingredients = ingredients;
        this.amount = amount;
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
     * @param {BackpackItemType[]} backpackContents - The list of items currently in the player's backpack.
     *
     * @returns {boolean} - True if the player has all the required ingredients to craft the recipe; otherwise, false.
     */
    canCraft(backpackContents: BackpackItemType[]): boolean {
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
     * @param {BackpackItemType[]} backpackContents - The list of items currently in the player's backpack.
     *
     * @returns {Ingredient[]} - An array of objects, each representing an item
     * missing from the backpack along with the amount of that item required to craft the recipe.
     * If no items are missing, an empty array is returned.
     */
    missingItems(backpackContents: BackpackItemType[]) {
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
