import { Item } from "./Item.js";
import type { Rarity } from "./Rarities.js";

export class InventoryItem extends Item {
    amount: number;
    constructor(
        rarity: Rarity,
        name: string,
        description: string,
        size: number,
        weight: number,
        scavenge: number,
        amount: number
    ) {
        super(rarity, name, description, size, weight, scavenge);
        this.amount = amount;
    }

    /**
     * Returns a inventory item from a item
     * @param item The item to create an inventory item from
     * @param amount The amount to set the inventory item to
     * @returns InventoryItem
     */
    public static createInventoryItem(item: Item, amount: number) {
        return new InventoryItem(
            item.rarity,
            item.name,
            item.description,
            item.size,
            item.weight,
            item.scavenge,
            amount
        );
    }
}
