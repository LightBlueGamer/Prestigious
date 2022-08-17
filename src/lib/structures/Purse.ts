import { Container } from "./Container";
import type { Rarity } from "./Rarity";

export class Purse extends Container {
    constructor(name: string, min: number, max: number, rarity: Rarity, weight: number, type: Container.Type = 'Coins') {
        super(name, min, max, rarity, weight, type);
    }
}