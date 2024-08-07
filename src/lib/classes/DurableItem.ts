import { CraftableItem } from "./CraftableItem.js";
import type { Recipe } from "./Recipe.js";

/**
 * Represents a durable item that extends the functionality of a craftable item.
 *
 * @class DurableItem
 * @extends {CraftableItem}
 */
export class DurableItem extends CraftableItem {
    /**
     * The durability of the item.
     *
     * @type {number}
     */
    durability: number;

    /**
     * Creates an instance of DurableItem.
     *
     * @param {string} name - The name of the item.
     * @param {number} size - The size of the item.
     * @param {number} value - The value of the item.
     * @param {number} weight - The weight of the item.
     * @param {Recipe} recipe - The recipe required to craft the item.
     * @param {number} durability - The durability of the item.
     * @memberof DurableItem
     */
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        recipe: Recipe,
        durability: number
    ) {
        super(name, size, value, weight, recipe);
        this.durability = durability;
    }
}
