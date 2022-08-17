import type { Player } from "./Player";
import type { Rarity } from "./Rarity";

export class Container {
    name: string;
    min: number;
    max: number;
    rarity: Rarity;
    weight: number;
    type: Container.Type;
    constructor(name: string, min: number, max: number, rarity: Rarity, weight: number, type: Container.Type) {
        this.name = name;
        this.min = min;
        this.max = max;
        this.rarity = rarity;
        this.weight = weight;
        this.type = type;
    }

    async use(player: Player) {
        if (this.type === 'Coins') {
            player.coins += Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
        } else if (this.type === 'Exp') {
            player.xp += Math.floor(Math.random() * (this.max - this.min + 1) + this.min);
        }

        return await player.save();
    }
}

export namespace Container {
    export type Type = 'Exp' | 'Coins'
}