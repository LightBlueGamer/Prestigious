import { Item } from "./Item.js";
import type { Rarity } from "./Rarities.js";

/**
 * The base class for Backpacks
 * @param level The level of the backpack
 * @param slots The number of slots the backpack has
 * @param inventory The items this backpack has
 * @returns Backpack
 */
export class Backpack extends Item {
    level: number;
    slots: number;
    inventory: Item[];
    constructor(
        rarity: Rarity,
        name: string,
        description: string,
        size: number,
        weight: number,
        scavenge: number,
        level: number,
        slots: number,
        inventory: Item[]
    ) {
        super(rarity, name, description, size, weight, scavenge);
        this.level = level;
        this.slots = slots;
        this.inventory = inventory;
    }

    /**
     * Returns the backpacks current inventory
     * @returns Backpack.inventory
     */
    public getItems() {
        return this.inventory;
    }

    /**
     * Returns the amount of items currently held in the backpack
     * @returns number
     */
    public getItemCount() {
        return this.inventory.length;
    }

    /**
     * Returns the amount of slots this backpack has
     * @returns number
     */
    public getSlots() {
        return this.slots;
    }
}
