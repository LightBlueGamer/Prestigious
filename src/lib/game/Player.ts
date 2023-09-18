import { db } from "../../db/index.js";
import type { Client } from "discord.js";
import { Backpack } from "./Backpack.js";
import { random } from "../../utils/misc.js";
import { Backpacks } from "./Catalog.js";
import type { InventoryItem } from "./InventoryItem.js";

/**
 * The base Player class with the ID, Name and Data of the player.
 * @example
 *  const player = await Player.get(interaction.user.id, interaction.client);
 *  player
 *      .addExp(10)
 *      .save();
 * @param id The ID of the player
 * @param name The Name of the player
 * @param data The Data of the player
 * @returns Player
 */
export class Player {
    id: string;
    name: string;
    data: Player.Data;
    constructor(id: string, name: string, data: Player.Data = generateData()) {
        this.id = id;
        this.name = name;
        this.data = data;
    }

    /**
     * Adds experience to the player
     * @param amount The amount of experience to add
     * @returns Player
     */
    public addExp(amount: number) {
        this.data.experience += Math.floor(amount);
        this.levelUp();
        return this;
    }

    /**
     * Removes experience from the player
     * @param amount The amount of experience to remove
     * @returns Player
     */
    public removeExp(amount: number) {
        if (this.data.experience - Math.floor(amount) < 0)
            this.data.experience = 0;
        else this.data.experience -= Math.floor(amount);
        return this;
    }

    /**
     * Set experience of the player
     * @param amount The amount to set the players experience to
     * @returns Player
     */
    public setExp(amount: number) {
        this.data.experience = Math.floor(amount);
        return this;
    }

    /**
     * Shows experience of the player
     * @returns Player.data.experience
     */
    public showExp() {
        return this.data.experience;
    }

    /**
     * Adds money to the players wallet
     * @param amount The amount of money to add
     * @returns Player
     */
    public addBalWallet(amount: number) {
        this.data.wallet += Math.floor(amount);
        return this;
    }

    /**
     * Removes money from the players wallet
     * @param amount The amount of money to remove
     * @returns Player
     */
    public removeBalWallet(amount: number) {
        this.data.wallet -= Math.floor(amount);
        return this;
    }

    /**
     * Set the players wallet
     * @param amount The amount to set the players wallet to
     * @returns Player
     */
    public setBalWallet(amount: number) {
        this.data.wallet = Math.floor(amount);
        return this;
    }

    /**
     * Show the players wallet
     * @returns Player.data.wallet
     */
    public showBalWallet() {
        return this.data.wallet;
    }

    /**
     * Add money to the players bank account
     * @param amount The amount to add to the players bank account
     * @returns Player
     */
    public addBalBank(amount: number) {
        this.data.bank += Math.floor(amount);
        return this;
    }

    /**
     * Remove money from the players bank account
     * @param amount The amount to remove from the players bank account
     * @returns Player
     */
    public removeBalBank(amount: number) {
        this.data.bank -= Math.floor(amount);
        return this;
    }

    /**
     * Set the balance of the players bank account
     * @param amount The amount to set the players bank account to
     * @returns Player
     */
    public setBalBank(amount: number) {
        this.data.bank = Math.floor(amount);
        return this;
    }

    /**
     * Shows the balance of the players bank account
     * @returns Player.data.bank
     */
    public showBalBank() {
        return this.data.bank;
    }

    /**
     * Withdraw money from the players bank account into the wallet
     * @param amount The amount of money to withdraw from the players bank account
     * @returns Player
     */
    public withdraw(amount: number) {
        if (amount >= this.data.bank) {
            const toWithdraw = this.data.bank;
            this.data.bank -= toWithdraw;
            this.data.wallet += toWithdraw;
        } else {
            this.data.bank -= amount;
            this.data.wallet += amount;
        }
        return this;
    }

    /**
     * Deposit money from the players wallet to bank account
     * @param amount The amount of money to deplosit to the players bank account
     * @returns Player
     */
    public deposit(amount: number) {
        if (amount >= this.data.wallet) {
            const toDeposit = this.data.wallet;
            this.data.wallet -= toDeposit;
            this.data.bank += toDeposit;
        } else {
            this.data.wallet -= amount;
            this.data.bank += amount;
        }
        return this;
    }

    /**
     * Gets the players prestige
     * @returns Player.data.prestige
     */
    public showPrestige() {
        return this.data.prestige;
    }

    /**
     * Gets the players level
     * @returns Player.data.level
     */
    public showLevel() {
        return this.data.level;
    }

    /**
     * Gets the required experience that the player needs to level up
     * @returns Experience
     */
    public getExpRequired() {
        return this.data.level * 25 + 25;
    }

    /**
     * Gets the experience that is left for the player to level up
     * @returns Experience
     */
    public getExpLeft() {
        return this.getExpRequired() - this.data.experience;
    }

    /**
     * Gets the players backpack
     * @returns Player.data.backpack
     */
    public getBackpack() {
        return this.data.backpack;
    }

    /**
     * Get the players stats
     * @returns Player.Stats
     */
    public getStats() {
        return this.data.stats;
    }

    /**
     * Add a item to the players backpack
     * @param item The item to add to the backpack
     * @returns Player
     */
    public addItem(item: InventoryItem) {
        this.data.backpack.addItem(item);
        return this;
    }

    /**
     * Add items to the players backpack
     * @param items The items to add to the backpack
     * @returns Player
     */
    public addItems(items: InventoryItem[]) {
        this.data.backpack.addItems(items);
        return this;
    }

    //! Private Methods used by the class internally
    /**
     * Check if the player has enough experience to level up and if so level them up
     * @returns Player
     */
    private levelUp() {
        if (this.data.experience >= this.getExpRequired()) {
            this.data.experience -= this.getExpRequired();
            this.data.level++;
        }
        return this;
    }

    //! Internal Functions
    /**
     * Get a player from the given ID of a user
     * @param id The ID of the user to get the player from
     * @param client The bots Client
     * @returns Player
     */
    static async get(id: string, client: Client) {
        const user = await client.users.fetch(id);
        const player = new Player(id, user.username);
        if (user.bot) return player;
        return Player.fromJSON(await db.ensure(id, player.toJSON()));
    }

    /**
     * Create a player from JSON Data
     * @param object The JSON data of a player
     * @returns Player
     */
    static fromJSON(object: Player.JSON) {
        return new Player(object.id, object.name, object.data);
    }

    /**
     * Get a JSON object representing a Player
     * @returns Player.JSON
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            data: this.data,
        };
    }

    /**
     * Save the player to the database
     * @returns DB.Player.JSON
     */
    async save() {
        return db.set(this.id, this.toJSON());
    }
}

export namespace Player {
    export interface JSON {
        id: string;
        name: string;
        data: Data;
    }

    export interface Data {
        wallet: number;
        bank: number;
        prestige: number;
        level: number;
        experience: number;
        backpack: Backpack;
        stats: Stats;
    }

    export interface Stats {
        health: number;
        stamina: number;
        strength: number;
        defense: number;
        agility: number;
        intelligence: number;
        scavenge: number;
    }
}

/**
 * A function to generate the default player data.
 * @returns Player.Data
 */
export function generateData() {
    return {
        wallet: 0,
        bank: 0,
        prestige: 0,
        level: 0,
        experience: 0,
        backpack: Backpacks.Pouch,
        stats: {
            health: 10,
            stamina: 10,
            strength: random(0, 3),
            defense: random(0, 3),
            agility: random(0, 3),
            intelligence: random(0, 3),
            scavenge: 0,
        },
    };
}
