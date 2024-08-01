import type { Backpack } from "./Backpack.js";
import { CraftableItem } from "./CraftableItem.js";
import type { Recipe } from "./Recipe.js";

/**
 * Represents an item that can be equipped to a backpack.
 * Extends the functionality of a {@link CraftableItem} by adding a {@link Backpack}.
 */
export class BackpackEquipment extends CraftableItem {
    /**
     * The backpack that can be equipped with this item.
     */
    backpack: Backpack;

    /**
     * Constructs a new instance of BackpackEquipment.
     *
     * @param name - The name of the item.
     * @param size - The size of the item.
     * @param value - The value of the item.
     * @param weight - The weight of the item.
     * @param recipe - The recipe required to craft this item.
     * @param backpack - The backpack that can be equipped with this item.
     */
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        recipe: Recipe,
        backpack: Backpack
    ) {
        super(name, size, value, weight, recipe);
        this.backpack = backpack;
    }
}
