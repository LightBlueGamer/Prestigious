import type { Rarity } from "./Rarity";

export class InventoryItem {
    name: string;
    rarity: Rarity;
    amount: number;
    type: string;
    constructor(name: string, rarity: Rarity, amount: number, type: string) {
        this.name = name;
        this.rarity = rarity;
        this.amount = amount;
        this.type = type
    }
}