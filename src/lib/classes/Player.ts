import type { Client } from "discord.js";
import { db } from "../../db/index.js";
import {
    generateAttributes,
    generateData,
    generatePrestigeAttributes,
    numberToWord,
    randomNumber,
} from "../utils/functions.js";
import { emojis } from "../resources/emojis.js";
import type { Backpack } from "./Backpack.js";
import type { BackpackItem } from "./BackpackItem.js";
import type { Item } from "./Item.js";
import type { Lootbox } from "./Lootbox.js";
import { LootboxItem } from "./LootboxItem.js";
import { Statistic } from "./Statistic.js";
import type { Class } from "./Class.js";
import type { Attribute } from "./Attribute.js";
import { lootboxes } from "../resources/lootboxes.js";
import type { PrestigeAttribute } from "./PrestigeAttribute.js";

/**
 * The base Player class with the ID, Name and Data of the player.
 * @example
 *  const player = await Player.get(interaction.user.id, interaction.client);
 *  player
 *      .save();
 * @param id The ID of the player
 * @param name The Name of the player
 * @param data The Data of the player
 * @returns {Player}
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
     * Increases the player's XP by a random amount between the given minimum and maximum amounts.
     *
     * @param minAmount - The minimum amount of XP to increase.
     * @param maxAmount - The maximum amount of XP to increase.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.increaseXP(10, 50);
     * // player.data.xp will be increased by a random amount between 10 and 50.
     */
    increaseXP(minAmount: number, maxAmount: number): Player {
        const { expBoost } = this.getPrestigeBoosts();
        const randomAmount = Math.floor(
            randomNumber(minAmount, maxAmount) * expBoost
        );
        this.addStatistic("Experience earned", randomAmount);
        this.data.xp += randomAmount;
        return this;
    }

    /**
     * Increases the player's balance by a random amount between the given minimum and maximum amounts.
     *
     * @param minAmount - The minimum amount of balance to increase.
     * @param maxAmount - The maximum amount of balance to increase.
     *
     * @returns {Player} - Returns the instance of the Player class for method chaining.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.increaseBalance(10, 50);
     * // player.data.balance will be increased by a random amount between 10 and 50.
     */
    increaseBalance(minAmount: number, maxAmount: number): Player {
        const { moneyBoost } = this.getPrestigeBoosts();
        const randomAmount = Math.floor(
            randomNumber(minAmount, maxAmount) * moneyBoost
        );
        this.addStatistic("Money earned", randomAmount);
        this.data.balance += randomAmount;
        return this;
    }

    /**
     * Modifies the player's XP by adding the given amount.
     *
     * @param amount - The amount to increase the player's XP by.
     *
     * @returns {Player} - Returns the instance of the Player class for method chaining.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.modifyXp(50);
     * // player.data.xp will be increased by 50.
     */
    modifyXp(amount: number): Player {
        this.data.xp += amount;
        return this;
    }

    /**
     * Modifies the player's balance by adding the given amount.
     *
     * @param amount - The amount to increase the player's balance by.
     *
     * @returns {Player} - Returns the instance of the Player class for method chaining.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.modifyBalance(50);
     * // player.data.balance will be increased by 50.
     */
    modifyBalance(amount: number): Player {
        this.data.balance += amount;
        return this;
    }

    /**
     * Calculates and returns the required XP for the next level.
     *
     * @returns {number} The required XP for the next level.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.level = 1;
     * const requiredXP = player.requiredXp();
     * // requiredXP === 143
     */
    xpLeft(): number {
        return this.xpRequired() - this.data.xp;
    }

    /**
     * Calculates and returns the required XP for the next level.
     *
     * @returns {number} The required XP for the next level.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.level = 1;
     * const requiredXP = player.xpRequired();
     * // requiredXP === 143
     */
    xpRequired(): number {
        return Math.floor(
            7 *
                (6 * Math.pow(this.data.level + 1, 3) -
                    3 * (this.data.level + 1))
        );
    }

    /**
     * Calculates and updates the player's level based on their XP.
     * If the player's XP is greater than or equal to the required XP for their current level,
     * the player's level is increased by 1 and the players xp is reset to 0 with the excess xp added.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.xp = 2351;
     * player.data.level = 1;
     * player.levelUp();
     * // player.data.level === 2
     * // player.data.xp === 351
     */
    levelUp() {
        const requiredXP = this.xpRequired();
        if (this.data.xp >= requiredXP) {
            this.data.level++;
            this.data.xp -= requiredXP;
        }
    }

    /**
     * Generates a visual representation of the player's XP progression as a bar of emojis.
     * The bar consists of 10 segments, each representing 10% of the total XP required for the next level.
     * The bar is filled with different emojis based on the player's XP progression.
     *
     * @returns {string} A string representing the XP bar with emojis.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.xp = 2351;
     * player.data.level = 1;
     * const xpBar = player.generateBar();
     * // xpBar === "<:full_left:1234567890> <:full_middle:1234567890> <:full_middle:1234567890> <:full_middle:1234567890> <:5_middle:1234567890> <:empty_middle:1234567890> <:empty_middle:1234567890> <:empty_middle:1234567890> <:empty_middle:1234567890> <:empty_right:1234567890>"
     */
    generateBar(): string {
        const percentage = Math.floor((this.data.xp / this.xpRequired()) * 100);
        const bar = [];

        const findEmoji = (name: string) => {
            const emoji = emojis.find((emoji) => emoji.name === name);
            return `<:${emoji?.name}:${emoji?.id}>`;
        };

        if (percentage === 100) {
            const fullEmoji = findEmoji("full_middle");
            for (let i = 0; i < 10; i++) {
                bar.push(fullEmoji);
            }
        } else {
            const fullCount = Math.floor(percentage / 10);
            const partialDigit = percentage % 10;

            for (let i = 0; i < fullCount; i++) {
                bar.push(findEmoji("full_middle"));
            }

            if (partialDigit > 0) {
                bar.push(findEmoji(`${numberToWord(partialDigit)}_middle`));
            }

            const emptyCount = 10 - bar.length;
            for (let i = 0; i < emptyCount; i++) {
                bar.push(findEmoji("empty_middle"));
            }
        }

        bar[0] = findEmoji(bar[0].split(":")[1].replace("middle", "left"));
        bar[9] = findEmoji(bar[9].split(":")[1].replace("middle", "right"));

        return bar.join("");
    }

    /**
     * Transfers the specified amount of balance from the current player to another player.
     *
     * @param player - The player to transfer the balance to.
     * @param amount - The amount of balance to transfer.
     *
     * @returns {Player} - Returns the instance of the Player class for method chaining.
     *
     * @example
     * const player1 = new Player('1234567890', 'John Doe');
     * const player2 = new Player('9876543210', 'Jane Doe');
     * player1.payToUser(player2, 50);
     * // player1.data.balance will be decreased by 50.
     * // player2.data.balance will be increased by 50.
     */
    payToUser(player: Player, amount: number): Player {
        player.modifyBalance(amount).save();
        this.data.balance -= amount;
        return this;
    }

    /**
     * Returns the current balance of the player.
     *
     * @returns {number} The current balance of the player.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.balance = 500;
     * const balance = player.getBalance();
     * // balance === 500
     */
    getBalance(): number {
        return this.data.balance;
    }

    /**
     * Returns the current backpack of the player.
     *
     * @returns {Backpack} The current backpack of the player.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * const backpack = player.getBackpack();
     * // backpack === player.data.backpack
     */
    getBackpack(): Backpack {
        return this.data.backpack;
    }

    /**
     * Retrieves the contents of the player's backpack.
     *
     * @returns {BackpackItem[]} An array of BackpackItem objects representing the contents of the player's backpack.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * const backpackContents = player.getBackpackContents();
     * // backpackContents will contain the items in the player's backpack.
     */
    getBackpackContents(): BackpackItem[] {
        return this.getBackpack().getContents();
    }

    /**
     * Adds an item to the player's backpack.
     *
     * @param item - The item to add to the backpack.
     * @returns {Player} - Returns the instance of the Player class for method chaining.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * const sword = new Item('Sword', 100, 'A shiny sword.');
     * player.addItem(sword);
     * // The sword will be added to the player's backpack.
     */
    addItem(item: Item, amount: number = 1): Player {
        if (item instanceof LootboxItem) {
            const lootbox = Object.values(lootboxes).find(
                (lootbox) => lootbox.name === item.name
            )!;
            this.data.lootboxes?.push(lootbox);
        } else {
            this.getBackpack().addItem(item, amount);
        }
        return this;
    }
    /**
     * Opens a lootbox of the specified type and adds the resulting item to the player's backpack.
     * If the player does not have any lootboxes of the specified type, the function does nothing.
     *
     * @param lootbox - The type of lootbox to open.
     *
     * @returns {object} - Returns an object containing the player instance and the item obtained from the lootbox.
     * @returns {Player} - The player instance.
     * @returns {Item} - The item obtained from the lootbox.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.lootboxes = [
     *     new Lootbox(Lootbox.Type.COMMON, [new Item('Common Item', 10, 'A common item.')]),
     *     new Lootbox(Lootbox.Type.RARE, [new Item('Rare Item', 100, 'A rare item.')]),
     * ];
     * const { player, item } = player.openLootbox(Lootbox.Type.COMMON);
     * // The player's backpack will contain the 'Common Item'.
     */
    openLootbox(lootbox: Lootbox): { player: Player; item: Item } {
        const item = lootbox.open();
        this.addItem(item);
        return { player: this, item };
    }

    /**
     * Retrieves the lootboxes of the player.
     *
     * @returns {Lootbox[]} An array of Lootbox objects representing the player's lootboxes.
     * If the player does not have any lootboxes, it will return `null`.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.lootboxes = [
     *     new Lootbox(Lootbox.Type.COMMON, [new Item('Common Item', 10, 'A common item.')]),
     *     new Lootbox(Lootbox.Type.RARE, [new Item('Rare Item', 100, 'A rare item.')]),
     * ];
     * const lootboxes = player.getLootboxes();
     * // lootboxes will contain the player's lootboxes.
     */
    getLootboxes(): Lootbox[] {
        return this.data.lootboxes!;
    }

    /**
     * Removes the specified amount of balance from the current player.
     *
     * @param amount - The amount of balance to remove.
     *
     * @returns {Player} - Returns the instance of the Player class for method chaining.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.removeBalance(50);
     * // player.data.balance will be decreased by 50.
     */
    removeBalance(amount: number): Player {
        this.data.balance -= amount;
        return this;
    }

    /**
     * Removes the specified item from the player's backpack.
     * If the item has more than one quantity, it decreases the quantity by one.
     * If the item has only one quantity, it removes the item from the backpack.
     *
     * @param item - The item to remove from the backpack.
     * @returns {Player} - Returns the instance of the Player class for method chaining.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * const sword = new Item('Sword', 100, 'A shiny sword.');
     * player.addItem(sword);
     * player.addItem(sword);
     * player.removeItem(sword);
     * // The player's backpack will contain only one 'Sword'.
     */
    removeItem(item: Item, amount: number = 1): Player {
        const itm = this.getBackpackContents().find(
            (itm) => itm.name === item.name
        )!;
        if (itm.amount > amount) {
            itm.amount -= amount;
        } else {
            this.getBackpackContents().splice(
                this.getBackpackContents().indexOf(itm),
                1
            );
        }
        return this;
    }

    /**
     * Adds a statistic to the player's statistics list.
     * If the statistic already exists, the amount is incremented.
     * If the statistic does not exist, a new Statistic instance is created and added to the list.
     *
     * @param statName - The name of the statistic to add.
     * @param amount - The amount to increment the statistic's value by. Default is 1.
     *
     * @returns {Player} - Returns the instance of the Player class for method chaining.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.addStatistic('kills', 5);
     * // The player's statistics list will contain a Statistic instance with the name 'kills' and the amount 5.
     */
    addStatistic(statName: string, amount: number = 1): Player {
        const stats = this.data.statistics;
        const stat = stats.find((s) => s.name === statName);

        if (stat) stat.amount += amount;
        else stats.push(new Statistic(statName, amount));

        return this;
    }

    /**
     * Checks if the player can prestige.
     * A player can prestige when they have reached a level of 20 or more.
     *
     * @returns {boolean} `true` if the player can prestige, `false` otherwise.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.level = 20;
     * console.log(player.canPrestige()); // Output: true
     *
     * player.data.level = 19;
     * console.log(player.canPrestige()); // Output: false
     */
    canPrestige() {
        return this.data.level >= 20;
    }

    /**
     * Performs a prestige action for the player.
     * Resets the player's level, XP, balance, prestige points, prestige count, and attributes.
     * Adds a statistic to the player's statistics list indicating the number of times prestiged.
     *
     * @returns The updated Player instance.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.level = 20;
     * player.data.xp = 1000;
     * player.data.balance = 500;
     * player.data.prestigePoints = 10;
     * player.data.prestige = 2;
     * player.data.attributes = [...];
     *
     * player.prestige();
     * // The player's level, XP, balance, prestige points, prestige count, and attributes are reset.
     * // A statistic with the name 'Times Prestiged' is added to the player's statistics list.
     */
    prestige() {
        this.reset(true);
        this.addStatistic("Times Prestiged");
        return this;
    }

    /**
     * Resets the player's data based on the provided reset options.
     *
     * @param prestigeReset - If `true`, resets the player's level, XP, balance, prestige points, prestige count, and attributes.
     * @param fullReset - If `true`, resets all player's data to the initial state, including prestige points, prestige count, and attributes.
     *
     * @returns The updated Player instance.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.level = 20;
     * player.data.xp = 1000;
     * player.data.balance = 500;
     * player.data.prestigePoints = 10;
     * player.data.prestige = 2;
     * player.data.attributes = [...];
     *
     * player.reset(true);
     * // The player's level, XP, balance, prestige points, prestige count, and attributes are reset.
     *
     * player.reset(false, true);
     * // All player's data is reset to the initial state, including prestige points, prestige count, and attributes.
     */
    reset(prestigeReset: boolean = false, fullReset: boolean = false) {
        if (fullReset) {
            this.data = generateData();
        } else if (prestigeReset) {
            this.data.xp = 0;
            this.data.level = 0;
            this.data.balance = 0;
            this.data.prestigePoints++;
            this.data.prestige++;
            this.data.attributes = generateAttributes();
            this.data.statPoints = 18;
        } else {
            this.data.xp = 0;
            this.data.level = 0;
            this.data.balance = 0;
            this.data.prestigePoints = 0;
            this.data.prestige = 0;
            this.data.attributes = generateAttributes();
            this.data.prestigeAttributes = generatePrestigeAttributes();
            this.data.statPoints = 18;
        }
        return this;
    }

    /**
     * Retrieves the attributes of the player.
     * @returns {Attribute[]} An array of Attribute objects representing the player's attributes.
     */
    getAttributes(): Attribute[] {
        return this.data.attributes;
    }

    /**
     * Retrieves an attribute from the player's attributes list based on the provided name.
     * The search is case-insensitive and matches the beginning of the attribute's name.
     * If no attribute is found, it throws an error.
     *
     * @param name - The name of the attribute to retrieve.
     * @returns The attribute with the matching name.
     * @throws Will throw an error if no attribute is found with the provided name.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.attributes = [
     *     new Attribute('Strength', 10),
     *     new Attribute('Dexterity', 8),
     * ];
     * const strengthAttribute = player.getAttribute('Strength');
     * // strengthAttribute will be the Attribute instance with the name 'Strength'.
     */
    getAttribute(name: string): Attribute {
        return this.getAttributes().find((attr) =>
            attr.name.toLowerCase().startsWith(name)
        )!;
    }

    /**
     * Increases the value of the attribute with the specified name by the provided amount.
     * If the attribute is found, its value is updated and the updated Player instance is returned.
     * If the attribute is not found, the function does nothing and returns the original Player instance.
     *
     * @param name - The name of the attribute to increase.
     * @param amount - The amount to increase the attribute's value by.
     *
     * @returns The updated Player instance with the increased attribute value.
     *          If the attribute is not found, the original Player instance is returned.
     */
    increaseAttribute(name: string, amount: number): Player {
        const attribute = this.getAttribute(name);
        if (attribute.value === 10) return this;
        if (attribute) attribute.value += amount;
        return this;
    }

    /**
     * Decreases the value of the attribute with the specified name by the provided amount.
     * If the attribute is found, its value is updated and the updated Player instance is returned.
     * If the attribute is not found, the function does nothing and returns the original Player instance.
     *
     * @param name - The name of the attribute to decrease.
     * @param amount - The amount to decrease the attribute's value by.
     *
     * @returns The updated Player instance with the decreased attribute value.
     *          If the attribute is not found, the original Player instance is returned.
     */
    decreaseAttribute(name: string, amount: number): Player {
        const attribute = this.getAttribute(name);
        if (attribute.value === 0) return this;
        if (attribute) attribute.value -= amount;
        return this;
    }

    /**
     * Sets the value of the attribute with the specified name to the provided value.
     * If the attribute is found, its value is updated and the updated Player instance is returned.
     * If the attribute is not found, the function does nothing and returns the original Player instance.
     *
     * @param name - The name of the attribute to set.
     * @param value - The value to set the attribute's value to.
     *
     * @returns The updated Player instance with the set attribute value.
     *          If the attribute is not found, the original Player instance is returned.
     */
    setAttribute(name: string, value: number): Player {
        const attribute = this.getAttribute(name);
        if (attribute) attribute.value = value;
        return this;
    }

    /**
     * Checks if the player has any stat points left.
     * A player has stat points when their level is greater than 1.
     *
     * @returns {boolean} `true` if the player has stat points, `false` otherwise.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.level = 2;
     * player.data.statPoints = 10;
     * console.log(player.hasStatPoints()); // Output: true
     *
     * player.data.level = 1;
     * player.data.statPoints = 0;
     * console.log(player.hasStatPoints()); // Output: false
     */
    hasStatPoints(): boolean {
        return this.data.statPoints > 0;
    }

    /**
     * Retrieves the prestige boosts for experience and money.
     * The prestige boosts are calculated based on the values of the 'Experience Boost' and 'Money Boost' attributes.
     * The boosts are calculated by adding the attribute values to 1 and dividing by 10.
     *
     * @returns An object containing the prestige boosts for experience and money.
     * @property {number} ExpBoost - The prestige boost for experience, calculated as 1 + (Experience Boost attribute value / 10).
     * @property {number} MoneyBoost - The prestige boost for money, calculated as 1 + (Money Boost attribute value / 10).
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.prestigeAttributes = [
     *     new PrestigeAttribute('Experience Boost', 20),
     *     new PrestigeAttribute('Money Boost', 15),
     * ];
     * const boosts = player.getPrestigeBoosts();
     * // boosts = { ExpBoost: 3, MoneyBoost: 2.5 }
     */
    getPrestigeBoosts() {
        const attributes = this.data.prestigeAttributes;
        const [experienceBoost, moneyBoost] = attributes;
        return {
            expBoost: 1 + experienceBoost.value / 10,
            moneyBoost: 1 + moneyBoost.value / 10,
        };
    }

    /**
     * Retrieves the prestige attributes of the player.
     * @returns An array of PrestigeAttribute instances representing the player's prestige attributes.
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.prestigeAttributes = [
     *     new PrestigeAttribute('Experience Boost', 20),
     *     new PrestigeAttribute('Money Boost', 15),
     * ];
     * const prestigeAttributes = player.getPrestigeAttributes();
     * // prestigeAttributes = [
     * //     { name: 'Experience Boost', value: 20 },
     * //     { name: 'Money Boost', value: 15 },
     * // ]
     */
    getPrestigeAttributes() {
        return this.data.prestigeAttributes;
    }

    /**
     * Retrieves a prestige attribute from the player's prestige attributes list based on the provided name.
     * The search is case-insensitive and matches the beginning of the attribute's name.
     * If no attribute is found, it returns `undefined`.
     *
     * @param name - The name of the prestige attribute to retrieve.
     * @returns The prestige attribute with the matching name, or `undefined` if no attribute is found.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.prestigeAttributes = [
     *     new PrestigeAttribute('Experience Boost', 20),
     *     new PrestigeAttribute('Money Boost', 15),
     * ];
     * const experienceBoostAttribute = player.getPrestigeAttribute('Experience Boost');
     * // experienceBoostAttribute = { name: 'Experience Boost', value: 20 }
     */
    getPrestigeAttribute(name: string): PrestigeAttribute {
        return this.getPrestigeAttributes().find(
            (attribute) => attribute.name.toLowerCase() === name.toLowerCase()
        )!;
    }

    /**
     * Increases the value of the prestige attribute with the specified name by the provided amount.
     * If the attribute is found, its value is updated and the updated Player instance is returned.
     * If the attribute is not found, the function does nothing and returns the original Player instance.
     *
     * @param name - The name of the prestige attribute to increase.
     * @param amount - The amount to increase the attribute's value by. Default is 1.
     *
     * @returns The updated Player instance with the increased prestige attribute value.
     *          If the attribute is not found, the original Player instance is returned.
     */
    increasePrestigeAttribute(name: string, amount: number = 1): Player {
        const attribute = this.getPrestigeAttribute(name);
        if (attribute) attribute.value += amount;
        return this;
    }

    /**
     * Decreases the value of the prestige attribute with the specified name by the provided amount.
     * If the attribute is found and its value is greater than 0, its value is updated and the updated Player instance is returned.
     * If the attribute is not found or its value is 0, the function does nothing and returns the original Player instance.
     *
     * @param name - The name of the prestige attribute to decrease.
     * @param amount - The amount to decrease the attribute's value by. Default is 1.
     *
     * @returns The updated Player instance with the decreased prestige attribute value.
     *          If the attribute is not found or its value is 0, the original Player instance is returned.
     */
    decreasePrestigeAttribute(name: string, amount: number = 1) {
        const attribute = this.getPrestigeAttribute(name);
        if (attribute && attribute.value > 0) attribute.value -= amount;
        return this;
    }

    /**
     * Sets the value of the prestige attribute with the specified name to the provided value.
     * If the attribute is found, its value is updated and the updated Player instance is returned.
     * If the attribute is not found, the function does nothing and returns the original Player instance.
     *
     * @param name - The name of the prestige attribute to set.
     * @param value - The value to set the attribute's value to.
     *
     * @returns The updated Player instance with the set prestige attribute value.
     *          If the attribute is not found, the original Player instance is returned.
     */
    setPrestigeAttribute(name: string, value: number) {
        const attribute = this.getPrestigeAttribute(name);
        if (attribute) attribute.value = value;
        return this;
    }

    /**
     * Retrieves the number of stat points the player has.
     *
     * @returns The number of stat points the player has.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.statPoints = 10;
     * console.log(player.getStatPoints()); // Output: 10
     */
    getStatPoints() {
        return this.data.statPoints;
    }

    /**
     * Retrieves the number of prestige points the player has.
     *
     * @returns The number of prestige points the player has.
     *
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * player.data.prestigePoints = 10;
     * console.log(player.getPrestigePoints()); // Output: 10
     */
    getPrestigePoints() {
        return this.data.prestigePoints;
    }

    // !!!OBS!!! Internal Functions !!!OBS!!!

    /**
     * Static method to get a player from the database or create a new one if not found.
     * @param id The ID of the player.
     * @param client The Discord.js client instance.
     * @returns A new Player instance if the user is a bot, otherwise, a Player instance fetched from the database.
     * @example
     * const player = await Player.get(interaction.user.id, interaction.client);
     */
    static async get(id: string, client: Client) {
        const user = await client.users.fetch(id);
        const player = new Player(id, user.username);
        if (user.bot) return player;
        return Player.fromJSON(await db.ensure(id, player.toJSON()));
    }

    /**
     * Static method to create a new Player instance from a JSON object.
     * @param object The JSON object to create a Player instance from.
     * @returns A new Player instance with the provided JSON object's properties.
     * @example
     * const playerJSON = { id: '1234567890', name: 'John Doe' };
     * const player = Player.fromJSON(playerJSON);
     */
    static fromJSON(object: Player.JSON) {
        return new Player(object.id, object.name, object.data);
    }

    /**
     * Converts the Player instance into a JSON object.
     * @returns A JSON object containing the Player's id and name.
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * const playerJSON = player.toJSON();
     * // playerJSON = { id: '1234567890', name: 'John Doe' }
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            data: this.data,
        };
    }

    /**
     * Saves the current state of the Player instance to the database.
     * @returns A Promise that resolves to the result of the database set operation.
     * @example
     * const player = new Player('1234567890', 'John Doe');
     * await player.save();
     * // The player's data is now saved to the database.
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
        balance: number;
        xp: number;
        level: number;
        prestige: number;
        backpack: Backpack;
        lootboxes: Lootbox[] | null;
        statistics: Statistic[];
        class: Class | null;
        attributes: Attribute[];
        statPoints: number;
        prestigePoints: number;
        prestigeAttributes: PrestigeAttribute[];
    }
}
