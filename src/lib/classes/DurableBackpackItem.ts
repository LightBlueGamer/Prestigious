import { BackpackItem } from "./BackpackItem.js";

export class DurableBackpackItem extends BackpackItem {
    durability: number;
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        buy: boolean,
        sell: boolean,
        canScavenge: boolean,
        inLootbox: boolean,
        amount: number,
        durability: number
    ) {
        super(
            name,
            size,
            value,
            weight,
            buy,
            sell,
            canScavenge,
            inLootbox,
            amount
        );
        this.durability = durability;
    }
}
