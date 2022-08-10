import type { Rarity } from "./Rarity";

export class Reward {
    name: string;
    description: string;
    rarity: Rarity;
    weight: number;
    type: string;
    constructor(
        name: string, 
        description: string, 
        rarity: Rarity | Rarity, 
        weight: number, 
        type: string
    ) {
        this.name = name;
        this.description = description;
        this.rarity = rarity;
        this.weight = weight;
        this.type = type;
    }
}