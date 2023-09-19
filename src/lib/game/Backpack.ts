import type { InventoryItem } from "./InventoryItem.js";
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
    inventory: InventoryItem[];
    constructor(
        rarity: Rarity,
        name: string,
        description: string,
        size: number,
        weight: number,
        scavenge: number,
        level: number,
        slots: number,
        inventory: InventoryItem[]
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
        return this.inventory.reduce((p, c) => p + c.amount, 0);
    }

    /**
     * Returns the amount of slots this backpack has
     * @returns number
     */
    public getSlots() {
        return this.slots;
    }

    /**
     * Add a item to the backpacks inventory
     * @param item The item to be added to the inventory
     * @returns Inventory
     */
    public addItem(item: InventoryItem) {
        const itm = this.inventory.find((i) => i.name === item.name);
        if (itm) itm.amount += item.amount;
        else this.inventory.push(item);
        return this.inventory;
    }

    /**
     * Add items to the backpacks inventory
     * @param items The items to be added to the inventory
     * @returns Inventory
     */
    public addItems(items: InventoryItem[]) {
        for (const item of items) this.addItem(item);
        return this.inventory;
    }
    
    /**
     * Checks if the backpack is full or not and returns a boolean
     * @returns Boolean
     */
    public isFull() {
        if(this.getItemCount() >= this.getSlots()) return true
        return false;
    }
}
