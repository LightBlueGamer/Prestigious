import type Josh from "@joshdb/core";
import type { Client } from "discord.js";
import { econ, globalEcon } from "../../database";

export class Player {
    id: string;
    name: string;
    level: number;
    experience: number;
    balance: number;
    bank: number;
    constructor(
        id: string,
        name: string,
        level: number = 1,
        experience: number = 0,
        balance: number = 0,
        bank: number = 0,
    ) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.experience = experience;
        this.balance = balance;
        this.bank = bank;
    }

    // Chained functions

    deposit(amount: number) {
        this.balance -= amount;
        this.bank += amount;
        return this;
    }

    withdraw(amount: number) {
        this.balance += amount;
        this.bank -= amount;
        return this;
    }

    giveRandomExp(min: number, max: number) {
        this.experience += Math.floor(Math.random() * (max - min) + min);
        return this;
    }

    giveRandomBalance(min: number, max: number) {
        this.balance += Math.floor(Math.random() * (max - min) + min);
        return this;
    }

    levelUp() {
        this.experience -= this.expRequirement();
        this.level++;
        if(this.experience >= this.expRequirement()) this.levelUp();
        return this;
    }

    updateName(name: string) {
        this.name = name;
        return this;
    }

    // Other functions

    getName() {
        const cleaned = this.name.replace(/^_|_$/igm, '').replace(/_/igm, ' ').replace(/[^a-zAZ0-9]/igm, '');
        return cleaned.endsWith("s") ? cleaned+"'" : cleaned+"'s"
    }
    
    // Internal functions

    expRequirement() {
        return 100 * (this.level**2) - (100*this.level);
    }

    // Required functions

    static async get(id: string, client: Client) {
        const user = await client.users.fetch(id);
        const player = new Player(id, user.username);
        if(user.bot) return player;
        return Player.fromJSON(await globalEcon.ensure(id, player.toJSON()));
    }

    static async getGuild(id: string, client: Client) {
        const [_guildId, userId] = id.split("-");
        const user = await client.users.fetch(userId);
        const player = new Player(id, user.username);
        if(user.bot) return player;
        return Player.fromJSON(await econ.ensure(id, player.toJSON()));
    }

    static fromJSON(object: Player.JSON) {
        return new Player(
            object.id,
            object.name,
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
            level: this.level,
            experience: this.experience,
            balance: this.balance,
            bank: this.bank,
        };
    }

    async save(database: Josh<Player.JSON>) {
        return database.set(this.id, this.toJSON());
    }
}

export namespace Player {
    export interface JSON {
        id: string;
        name: string;
        level: number;
        experience: number;
        balance: number;
        bank: number;
    }
}