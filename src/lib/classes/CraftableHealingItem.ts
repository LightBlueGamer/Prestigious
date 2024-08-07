import { CraftableItem } from "./CraftableItem.js";
import type { Recipe } from "./Recipe.js";

/**
 * Represents a craftable item that can be used to heal characters.
 * Extends the base {@link CraftableItem} class.
 */
export class CraftableHealingItem extends CraftableItem {
    /**
     * The amount of health points this item can restore.
     */
    healingAmount: number;

    /**
     * Constructs a new instance of {@link CraftableHealingItem}.
     *
     * @param name - The name of the item.
     * @param size - The size of the item in inventory slots.
     * @param value - The value of the item in gold coins.
     * @param weight - The weight of the item in pounds.
     * @param recipe - The recipe required to craft this item.
     * @param healingAmount - The amount of health points this item can restore.
     */
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        recipe: Recipe,
        healingAmount: number
    ) {
        super(name, size, value, weight, recipe);
        this.healingAmount = healingAmount;
    }
}
