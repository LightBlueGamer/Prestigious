import * as loottables from "../../game/loottables";
import type { Rarity } from "./Rarity";

export class Lootbox {
    name: string;
    description: string;
    rarity: Rarity;
    weight: number;
    price: number;
    loottable: string;
    constructor(
        name: string, 
        description: string, 
        rarity: Rarity, 
        weight: number, 
        price: number,
        loottable: string
    ) {
        this.name = name;
        this.description = description;
        this.rarity = rarity;
        this.weight = weight;
        this.price = price;
        this.loottable = loottable;
    }

    open() {
        const tables = Object.values(loottables);
        const loottable = tables.find(table => table.name.toLowerCase() === this.loottable.toLowerCase());
        if(!loottable) return;
        return loottable.generateReward();
    }
}