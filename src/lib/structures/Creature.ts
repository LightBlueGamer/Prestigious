import { creatures } from "../../database/main";
import type { Rarity } from "./Rarity";

export class Creature {
    name: string;
    description: string;
    health: number;
    stamina: number;
    rarity: Rarity;
    weight: number;
    constructor(
        name: string,
        description: string,
        health: number, 
        stamina: number, 
        rarity: Rarity, 
        weight: number)
     {
        this.name = name;
        this.description = description;
        this.health = health;
        this.stamina = stamina;
        this.rarity = rarity;
        this.weight = weight;
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description,
            health: this.health,
            stamina: this.stamina,
            rarity: this.rarity,
            weight: this.weight,
        };
    }

    static fromJSON(object: Creature.JSON) {
        return new Creature(
            object.name,
            object.description,
            object.health,
            object.stamina,
            object.rarity,
            object.weight
        );
    }

    static async get(name: string, description: string, health: number, stamina: number, rarity: Rarity, weight: number) {
        const defaultCreature = new Creature(name, description, health, stamina, rarity, weight);
        const dbCreature = await creatures.ensure(name, defaultCreature.toJSON());
        return Creature.fromJSON(dbCreature);
    }

    async save() {
        return creatures.set(this.name, this.toJSON());
    }
}

export namespace Creature {
    export interface JSON {
        name: string;
        description: string;
        health: number;
        stamina: number;
        rarity: Rarity;
        weight: number;
    }
}