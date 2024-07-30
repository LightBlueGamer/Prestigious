import { Item } from "./Item.js";
import type { Recipe } from "./Recipe.js";

/**
 * Represents a craftable item in the game.
 * Extends the base {@link Item} class.
 *
 * @constructor
 * @param {string} name - The name of the craftable item.
 * @param {number} size - The size of the craftable item in inventory units.
 * @param {number} value - The value of the craftable item in game currency.
 * @param {number} weight - The weight of the craftable item in inventory units.
 * @param {Recipe} recipe - The recipe of the item.
 */
export class CraftableItem extends Item {
    recipe: Recipe;
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        recipe: Recipe
    ) {
        super(name, size, value, weight, false, true, false, false);
        this.recipe = recipe;
    }
}
