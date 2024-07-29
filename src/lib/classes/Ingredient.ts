import type { Item } from "./Item.js";

/**
 * Represents an ingredient in a recipe.
 *
 * @class Ingredient
 * @property {Item} item - The item that is an ingredient.
 * @property {number} amount - The quantity of the ingredient.
 */
export class Ingredient {
    item: Item;
    amount: number;

    /**
     * Creates an instance of Ingredient.
     *
     * @param {Item} item - The item that is an ingredient.
     * @param {number} amount - The quantity of the ingredient.
     * @memberof Ingedient
     */
    constructor(item: Item, amount: number) {
        this.item = item;
        this.amount = amount;
    }
}
