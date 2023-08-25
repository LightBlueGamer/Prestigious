import type { Rarity } from "./Rarities.js";

export class Item {
    rarity: Rarity;
    name: string;
    description: string;
    size: number;
    constructor(
        rarity: Rarity,
        name: string,
        description: string,
        size: number
    ) {
        this.rarity = rarity;
        this.name = name;
        this.description = description;
        this.size = size;
    }
}
