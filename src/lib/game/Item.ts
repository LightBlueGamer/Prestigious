export class Item {
    name: string;
    size: number;
    value: number;
    weight: number;
    buy: boolean;
    sell: boolean;
    canScavenge: boolean;
    inLootbox: boolean;
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        buy: boolean = true,
        sell: boolean = true,
        canScavenge: boolean = true,
        inLootbox: boolean = true
    ) {
        this.name = name;
        this.size = size;
        this.value = value;
        this.weight = weight;
        this.buy = buy;
        this.sell = sell;
        this.canScavenge = canScavenge;
        this.inLootbox = inLootbox;
    }
}
