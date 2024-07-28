import type { Item } from "./Item";

/**
 * Represents the result of a recipe, containing an item and its amount.
 */
export class RecipeResult {
    /**
     * The item produced by the recipe.
     */
    item: Item;

    /**
     * The amount of the item produced by the recipe.
     */
    amount: number;

    /**
     * Constructs a new RecipeResult instance.
     *
     * @param item - The item produced by the recipe.
     * @param amount - The amount of the item produced by the recipe.
     */
    constructor(item: Item, amount: number) {
        this.item = item;
        this.amount = amount;
    }
}