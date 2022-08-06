import * as loottables from "../../game/loottables";

export class Lootbox {
    name;
    description;
    rarity;
    weight;
    price;
    loottable;
    constructor(
        name, 
        description, 
        rarity, 
        weight, 
        price,
        loottable
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
        return loottable.generateReward();
    }
}