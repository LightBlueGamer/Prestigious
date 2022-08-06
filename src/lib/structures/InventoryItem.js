import { Rarity } from "./Rarity";

export class InventoryItem {
    name;
    rarity;
    amount;
    type;
    constructor(name, rarity, amount, type) {
        this.name = name;
        this.rarity = rarity;
        this.amount = amount;
        this.type = type
    }
}