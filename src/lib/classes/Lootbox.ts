import {
    getRandomLootboxItemByWeight,
    randomNumber,
} from "../utils/functions.js";
import type { Item } from "./Item.js";

export class Lootbox {
    name: string;
    type: Lootbox.Type;
    rarity: Lootbox.Rarity;
    loot: Item[];
    constructor(
        name: string,
        type: Lootbox.Type,
        rarity: Lootbox.Rarity,
        loot: Item[]
    ) {
        this.name = name;
        this.type = type;
        this.rarity = rarity;
        this.loot = loot;
    }

    /**
     * Opens the lootbox and returns a random item based on the item weights.
     *
     * @returns {Item} - The randomly selected item from the lootbox.
     */
    open(): Item {
        const item = getRandomLootboxItemByWeight(this.loot);
        return item;
    }

    /**
     * Opens the lootbox multiple times and returns an array of random items based on the item weights.
     * The number of items returned is randomly determined between 1 and 3.
     *
     * @returns {Item[]} - An array of randomly selected items from the lootbox.
     */
    openMany(): Item[] {
        const amount = randomNumber(1, 3);
        const items: Item[] = [];
        for (let i = 0; i < amount; i++) {
            items.push(this.open());
        }

        return items;
    }
}

export namespace Lootbox {
    export enum Type {
        Standard = "Standard",
    }

    export enum Rarity {
        VeryCommon = "Very Common",
        Common = "Common",
        Uncommon = "Uncommon",
        Rare = "Rare",
        Epic = "Epic",
        Legendary = "Legendary",
    }
}
