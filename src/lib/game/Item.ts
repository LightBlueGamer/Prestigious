import type { Rarity } from "./Rarities";

/**
 * The base class for Items
 * @param rarity The rarity of the item
 * @param name The name of the item
 * @param description The description of the item
 * @param size The size of the item
 * @param weight The weight this item has
 * @param scavenge The scavenge level required for this item
 * @returns Backpack
 */

export class Item {
    rarity: Rarity;
    name: string;
    description: string;
    size: number;
    weight: number;
    scavenge: number;
    constructor(
        rarity: Rarity,
        name: string,
        description: string,
        size: number,
        weight: number,
        scavenge: number
    ) {
        this.rarity = rarity;
        this.name = name;
        this.description = description;
        this.size = size;
        this.weight = weight;
        this.scavenge = scavenge;
    }
}
