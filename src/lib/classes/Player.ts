import type { Client } from "discord.js";
import { economy } from "../../database/index.js";

export class Player {
    id: string;
    name: string;
    prestige: number;
    level: number;
    experience: number;
    balance: number;
    bank: number;
    constructor(
        id: string,
        name: string,
        prestige: number = 0,
        level: number = 1,
        experience: number = 0,
        balance: number = 0,
        bank: number = 0,
    ) {
        this.id = id;
        this.name = name;
        this.prestige = prestige;
        this.level = level;
        this.experience = experience;
        this.balance = balance;
        this.bank = bank;
    }

    addMoney(amount: number) {
        this.balance += Math.floor(amount);
        return this;
    }

    addExperience(amount: number) {
        this.experience += Math.floor(amount);
        return this;
    }

    increaseLevel() {
        this.experience -= this.experienceRequirement();
        this.level++;
        if(this.experience >= this.experienceRequirement()) this.increaseLevel();
        return this;
    }

    depositMoney(amount: number) {
        if(amount >= this.balance) {
            this.bank += this.balance;
            this.balance -= this.balance;
        } else {
            this.bank += amount;
            this.balance -= amount;
        }
        return this;
    }

    withdrawMoney(amount: number) {
        if(amount >= this.bank) {
            this.balance += this.bank;
            this.bank -= this.bank;
        } else {
            this.balance += amount;
            this.bank -= amount;
        }
        return this;
    }

    removeMoney(amount: number) {
        this.balance -= amount;
        return this;
    }

    // Internals

    experienceRequirement() {
        return Math.floor(((this.level-1) * 100) + (this.level * 100));
    }

    // Required functions

    static async get(id: string, client: Client) {
        const user = await client.users.fetch(id);
        const player = new Player(id, user.username);
        if (user.bot) return player;
        return Player.fromJSON(await economy.ensure(id, player.toJSON()));
    }

    static fromJSON(object: Player.JSON) {
        return new Player(
            object.id,
            object.name,
            object.prestige,
            object.level,
            object.experience,
            object.balance,
            object.bank,
        );
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            prestige: this.prestige,
            level: this.level,
            experience: this.experience,
            balance: this.balance,
            bank: this.bank,
        };
    }

    async save() {
        return economy.set(this.id, this.toJSON());
    }
}

export namespace Player {
    export interface JSON {
        id: string;
        name: string;
        prestige: number;
        level: number;
        experience: number;
        balance: number;
        bank: number;
    }
}