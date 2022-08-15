import type { Rarity } from "./Rarity";

export class Booster {
    name: string;
    type: Booster.Type;
    duration: number;
    multiplier: number;
    weight: number;
    rarity: Rarity;
    constructor(name: string, type: Booster.Type, duration: number, multiplier: number, weight: number, rarity: Rarity) {
        this.name = name;
        this.type = type;
        this.duration = duration;
        this.multiplier = multiplier;
        this.weight = weight;
        this.rarity = rarity;
    }
}

export namespace Booster {
    export type Type = 'xp' | 'coins';
}