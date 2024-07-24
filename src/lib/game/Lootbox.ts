import { getRandomLootboxItemByWeight } from "../../utils/functions.js";
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

    open(): Item {
        const item = getRandomLootboxItemByWeight(this.loot);
        return item;
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
