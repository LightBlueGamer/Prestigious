import { Item } from "./Item.js";

/**
 * A class representing a lootbox item, which extends the base {@link Item} class.
 * This class can be used to create instances of lootbox items with specific properties.
 */
export class LootboxItem extends Item {
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        buy: boolean = true,
        sell: boolean = true,
        canScavenge: boolean = true,
        inLootbox: boolean = false
    ) {
        super(name, size, value, weight, buy, sell, canScavenge, inLootbox);
    }
}
