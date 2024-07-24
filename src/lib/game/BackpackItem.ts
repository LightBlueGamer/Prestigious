import { Item } from "./Item.js";

export class BackpackItem extends Item {
    amount: number;
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
