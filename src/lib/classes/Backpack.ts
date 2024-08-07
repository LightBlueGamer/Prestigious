import type { BackpackItemType } from "../types/types.js";
import { BackpackItem } from "./BackpackItem.js";
import { DurableBackpackItem } from "./DurableBackpackItem.js";
import { DurableItem } from "./DurableItem.js";
import type { Item } from "./Item.js";

/**
 * Represents a backpack with a name, size, slots, and contents.
 */
export class Backpack {
    /**
     * The name of the backpack.
     */
    name: string;

    /**
     * The total size of the backpack.
     */
    size: number;

    /**
     * The number of slots available in the backpack.
     */
    slots: number;

    /**
     * The items currently in the backpack.
     */
    contents: BackpackItemType[];

    /**
     * Constructs a new instance of the Backpack class.
     * @param name - The name of the backpack.
     * @param size - The total size of the backpack.
     * @param slots - The number of slots available in the backpack.
     * @param contents - The items currently in the backpack.
     */
    constructor(
        name: string,
        size: number,
        slots: number,
        contents: BackpackItemType[]
    ) {
        this.name = name;
        this.size = size;
        this.slots = slots;
        this.contents = contents;
    }

    /**
     * Retrieves the contents of the backpack.
     * @returns The items currently in the backpack.
     */
    getContents(): BackpackItemType[] {
        return this.contents;
    }

    /**
     * Calculates the remaining free space in the backpack.
     * @returns The number of free slots in the backpack.
     */
    getFreeSpace(): number {
        let usedSlots: number = 0;

        for (let item of this.contents) {
            usedSlots += item.size * item.amount;
        }

        return this.slots - usedSlots;
    }

    /**
     * Adds an item to the backpack.
     * If the item already exists in the backpack, the amount is increased.
     * @param item - The item to add.
     * @param amount - The quantity of the item to add.
     * @returns The updated backpack instance.
     */
    addItem(item: Item, amount: number): Backpack {
        const bItem = this.getContents().find((i) => i.name === item.name);
        if (!bItem) {
            if (item instanceof DurableItem) {
                this.contents.push(
                    new DurableBackpackItem(
                        item.name,
                        item.size,
                        item.value,
                        item.weight,
                        item.buy,
                        item.sell,
                        item.canScavenge,
                        item.inLootbox,
                        amount,
                        item.durability
                    )
                );
            } else {
                this.contents.push(
                    new BackpackItem(
                        item.name,
                        item.size,
                        item.value,
                        item.weight,
                        item.buy,
                        item.sell,
                        item.canScavenge,
                        item.inLootbox,
                        amount
                    )
                );
            }
        } else {
            bItem.amount += amount;
        }
        return this;
    }
}
