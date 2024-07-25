import { Item } from "./Item.js";

/**
 * Represents an item that can be stored in a backpack.
 * Extends the base `Item` class with an additional `amount` property.
 */
export class BackpackItem extends Item {
    /** The amount of this item in the backpack. */
    amount: number;

    /**
     * Constructs a new instance of `BackpackItem`.
     *
     * @param name - The name of the item.
     * @param size - The size of the item in backpack slots.
     * @param value - The value of the item in currency.
     * @param weight - The weight of the item in kilograms.
     * @param buy - Indicates whether the item can be bought from vendors.
     * @param sell - Indicates whether the item can be sold to vendors.
     * @param canScavenge - Indicates whether the item can be found in scavenger hunts.
     * @param inLootbox - Indicates whether the item can be found in lootboxes.
     * @param amount - The amount of this item in the backpack.
     */
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        buy: boolean,
        sell: boolean,
        canScavenge: boolean,
        inLootbox: boolean,
        amount: number
    ) {
        super(name, size, value, weight, buy, sell, canScavenge, inLootbox);
        this.amount = amount;
    }
}
