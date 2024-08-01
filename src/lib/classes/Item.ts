/**
 * Represents an item in the game.
 *
 * @constructor
 * @param {string} name - The name of the item.
 * @param {number} size - The size of the item.
 * @param {number} value - The value of the item.
 * @param {number} weight - The weight of the item.
 * @param {boolean} [buy=true] - Whether the item can be bought.
 * @param {boolean} [sell=true] - Whether the item can be sold.
 * @param {boolean} [canScavenge=true] - Whether the item can be scavenged.
 * @param {boolean} [inLootbox=true] - Whether the item can be found in a lootbox.
 */
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
        buy: boolean = false,
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
