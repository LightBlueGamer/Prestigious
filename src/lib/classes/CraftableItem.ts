import { recipes } from "../library.js";
import { Item } from "./Item.js";

/**
 * Represents a craftable item in the game.
 * Extends the base {@link Item} class.
 *
 * @constructor
 * @param {string} name - The name of the craftable item.
 * @param {number} size - The size of the craftable item in inventory units.
 * @param {number} value - The value of the craftable item in game currency.
 * @param {number} weight - The weight of the craftable item in inventory units.
 * @param {boolean} [sell=true] - Indicates whether the craftable item can be sold to NPCs.
 *                               Default value is `true`.
 */
export class CraftableItem extends Item {
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        sell: boolean = true
    ) {
        super(name, size, value, weight, false, sell, false, false);
        const recipe = Object.values(recipes).find(r => r.getResultItem().name.toLowerCase() === name.toLowerCase())!;
        this.value = recipe.getIngredients().reduce((acc, i) => acc + i.item.value, 0)
    }
}
