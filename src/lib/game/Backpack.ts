import { BackpackItem } from "./BackpackItem.js";
import type { Item } from "./Item.js";

export class Backpack {
    name: string;
    size: number;
    slots: number;
    contents: BackpackItem[];
    constructor(
        name: string,
        size: number,
        slots: number,
        contents: BackpackItem[]
    ) {
        this.name = name;
        this.size = size;
        this.slots = slots;
        this.contents = contents;
    }

    getContents(): BackpackItem[] {
        return this.contents;
    }

    getFreeSpace(): number {
        let usedSlots: number = 0;

        for (let item of this.contents) {
            usedSlots += item.size;
        }

        return (this.slots -= usedSlots);
    }

    addItem(item: Item, amount: number): Backpack {
        const bItem = this.getContents().find((i) => i.name === item.name);
        if (!bItem) {
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
        } else {
            bItem.amount += amount;
        }
        return this;
    }
}
