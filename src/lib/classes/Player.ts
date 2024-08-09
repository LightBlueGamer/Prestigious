import type { Client } from "discord.js";
import { db } from "../../db/index.js";
import {
    generateData,
    getPityNumberIncrease,
    numberToWord,
    randomNumber,
} from "../utils/functions.js";
import { emojis } from "../resources/emojis.js";
import type { Backpack } from "./Backpack.js";
import { Item } from "./Item.js";
import type { Lootbox } from "./Lootbox.js";
import { Statistic } from "./Statistic.js";
import type { Class } from "./Class.js";
import type { Attribute } from "./Attribute.js";
import type { PrestigeAttribute } from "./PrestigeAttribute.js";
import type { Equipment } from "./Equipment.js";
import { Weapon } from "./Weapon.js";
import { Shield } from "./Shield.js";
import { Helmet } from "./Helmet.js";
import { Cuirass } from "./Cuirass.js";
import { LegArmor } from "./LegArmor.js";
import { BackpackEquipment } from "./BackpackEquipment.js";
import { BackpackItem } from "./BackpackItem.js";
import { items } from "../resources/items.js";
import type { PityItem } from "../interfaces/PityItem.js";
import type { ArmorItemType, BackpackItemType } from "../types/types.js";
import { PlayerSaveManager } from "./PlayerSaveManager.js";

/**
 * Represents a player in the game.
 */
export class Player {
    /**
     * The player's unique identifier.
     */
    public id: string;
    /**
     * The player's name.
     */
    public name: string;
    /**
     * The player's data.
     */
    public data: Player.Data;

    /**
     * Creates a new player instance.
     * @param id - The unique identifier for the player.
     * @param name - The name of the player.
     * @param data - The player's data. Default is generated data.
     */
    public constructor(
        id: string,
        name: string,
        data: Player.Data = generateData()
    ) {
        this.id = id;
        this.name = name;
        this.data = data;
    }

    /**
     * Gets the player's balance.
     */
    public get balance() {
        return this.data.balance;
    }

    /**
     * Sets the player's balance.
     */
    private set balance(amount) {
        this.data.balance = amount;
    }

    /**
     * Increases the player's balance by a random amount between the specified minimum and maximum values.
     *
     * @param min - The minimum amount to increase.
     * @param max - The maximum amount to increase.
     * @returns The player instance, for chaining.
     * @throws {Error} If min is greater than max or if any value is negative.
     */
    public increaseBalance(min: number, max: number) {
        if (min < 0 || max < 0) {
            throw new Error("Minimum and maximum values must be non-negative.");
        }
        if (min > max) {
            throw new Error(
                "Minimum value cannot be greater than the maximum value."
            );
        }

        const multiplier = this.premium ? 2 : 1;
        const amount = Math.round(
            randomNumber(min, max) * this.moneyBoost * multiplier
        );

        this.balance += amount;
        this.addStatistic("Money earned", amount);

        return this;
    }

    /**
     * Increases the player's balance by a random amount between the specified minimum and maximum values.
     *
     * @param min - The minimum amount to increase.
     * @param max - The maximum amount to increase.
     * @returns The player instance, for chaining.
     * @throws {Error} If min is greater than max or if any value is negative.
     */
    public decreaseBalance(amount: number) {
        if (amount < 0) {
            throw new Error("Amount must be non-negative.");
        }

        this.balance -= amount;
        this.addStatistic("Money earned", -amount);

        return this;
    }

    /**
     * Modifies the player's balance by adding the given amount.
     * Also adds a statistic to the player's statistics indicating the amount of money earned.
     *
     * @param amount - The amount to add to the player's balance.
     * @returns The player instance with the updated balance and statistics.
     */
    public modifyBalance(amount: number) {
        this.balance += amount;
        this.addStatistic("Money earned", amount);

        return this;
    }

    /**
     * Transfers a specified amount of balance to another player.
     * @param user - The player to receive the payment.
     * @param amount - The amount to transfer. Must be a positive number.
     * @returns The updated player instance.
     * @throws {Error} If the amount is negative or if the player does not have sufficient balance.
     */
    public payUser(user: Player, amount: number) {
        if (amount <= 0) {
            throw new Error("Amount to pay must be greater than zero.");
        }

        if (this.balance < amount) {
            throw new Error(
                "Insufficient balance to complete the transaction."
            );
        }

        user.balance += amount;
        user.save();

        this.balance -= amount;

        return this;
    }

    /**
     * Gets the player's experience points (XP).
     */
    public get xp() {
        return this.data.xp;
    }

    /**
     * Sets the player's experience points (XP).
     */
    private set xp(amount: number) {
        this.data.xp = amount;
    }

    /**
     * Gets the required experience points (XP) for the player's next level.
     *
     * The formula calculates the XP needed based on the player's current level.
     * It follows a cubic progression, which increases the required XP significantly with each level.
     *
     * @returns The amount of XP required for the next level.
     */
    public get requiredXp() {
        const level = Math.max(0, this.data.level);

        const baseXp = 7;
        const levelFactor = level + 1;
        const xpForNextLevel =
            baseXp * (6 * Math.pow(levelFactor, 3) - 3 * levelFactor);

        return Math.floor(xpForNextLevel);
    }

    /**
     * Gets the remaining experience points (XP) needed for the player to reach the next level.
     *
     * @returns The amount of XP needed to level up, ensuring the value is non-negative.
     */
    public get xpLeft() {
        const remainingXp = this.requiredXp - this.xp;
        return Math.max(0, remainingXp);
    }

    /**
     * Increases the player's experience points (XP) by a random amount between the specified min and max values.
     *
     * The actual increase is influenced by the player's intelligence, experience boost, and premium status.
     *
     * @param min - The minimum amount of XP to increase. Must be non-negative.
     * @param max - The maximum amount of XP to increase. Must be non-negative and greater than or equal to min.
     * @returns The player instance for chaining.
     * @throws {Error} If min is negative or max is less than min.
     */
    public increaseXp(min: number, max: number) {
        if (min < 0 || max < 0) {
            throw new Error(
                "Minimum and maximum XP values must be non-negative."
            );
        }
        if (min > max) {
            throw new Error(
                "Maximum XP value must be greater than or equal to the minimum value."
            );
        }

        const intelligenceMultiplier = 1 + 0.033 * this.intelligence;
        const premiumMultiplier = this.premium ? 2 : 1;
        const totalMultiplier =
            intelligenceMultiplier * this.expBoost * premiumMultiplier;

        const randomXp = Math.round(randomNumber(min, max) * totalMultiplier);

        this.xp += randomXp;
        this.addStatistic("Experience gained", randomXp);

        return this;
    }

    /**
     * Modifies the player's experience points (XP) by adding the given amount.
     * Also adds a statistic to the player's statistics indicating the amount of XP gained.
     *
     * @param amount - The amount of XP to add to the player's current XP.
     * @returns The player instance with the updated XP and statistics.
     */
    public modifyXp(amount: number) {
        this.xp += amount;
        this.addStatistic("Experience gained", amount);

        return this;
    }

    /**
     * Generates a visual representation of the player's progress to the next level.
     * The progress bar is composed of emojis representing full, partial, and empty sections.
     *
     * @returns A string representing the progress bar.
     */
    public generateBar() {
        const percentage = Math.floor((this.xp / this.requiredXp) * 100);

        const findEmoji = (name: string): string => {
            const emoji = emojis.find((emoji) => emoji.name === name);
            return emoji ? `<:${emoji.name}:${emoji.id}>` : "";
        };

        const bar: string[] = [];
        const totalBars = 10;

        const fullBars = Math.floor(percentage / 10);
        const partialBarValue = percentage % 10;
        const emptyBars = totalBars - fullBars - (partialBarValue > 0 ? 1 : 0);

        const fullEmoji = findEmoji("full_middle");
        for (let i = 0; i < fullBars; i++) {
            bar.push(fullEmoji);
        }

        if (partialBarValue > 0) {
            const partialEmoji = findEmoji(
                `${numberToWord(partialBarValue)}_middle`
            );
            bar.push(partialEmoji);
        }

        const emptyEmoji = findEmoji("empty_middle");
        for (let i = 0; i < emptyBars; i++) {
            bar.push(emptyEmoji);
        }

        if (bar.length > 0) {
            bar[0] = findEmoji(bar[0].split(":")[1].replace("middle", "left"));
            bar[bar.length - 1] = findEmoji(
                bar[bar.length - 1].split(":")[1].replace("middle", "right")
            );
        }

        return bar.join("");
    }

    /**
     * Gets the player's level.
     */
    public get level() {
        return this.data.level;
    }

    /**
     * Sets the player's level.
     */
    private set level(newLevel: number) {
        this.data.level = newLevel;
    }

    /**
     * Levels up the player if they have enough XP.
     * @returns The player instance.
     */
    public levelUp() {
        if (this.xp >= this.requiredXp) {
            this.xp -= this.requiredXp;
            this.level++;
            this.addStatistic("Level ups");
        }
        return this;
    }

    /**
     * Gets the player's prestige level.
     */
    public get prestige() {
        return this.data.prestige;
    }

    /**
     * Sets the player's prestige level.
     */
    private set prestige(newPrestige: number) {
        this.data.prestige = newPrestige;
    }

    /**
     * Checks if the player can prestige.
     */
    public get canPrestige() {
        return this.prestige >= 20;
    }

    /**
     * Increases the player's prestige level if they can prestige.
     * @returns The player instance.
     */
    public increasePrestige() {
        if (this.canPrestige) {
            this.prestige++;
            this.addStatistic("Prestiges completed");
            this.balance = 0;
            this.xp = 0;
            this.level = 1;
        }
        return this;
    }

    /**
     * Gets the player's backpack.
     */
    public get backpack() {
        return this.data.backpack;
    }

    /**
     * Sets the player's backpack.
     */
    private set backpack(backpack: Backpack) {
        this.data.backpack = backpack;
    }

    /**
     * Gets the contents of the player's backpack.
     */
    public get backpackContent() {
        return this.backpack.contents;
    }

    /**
     * Sets the contents of the player's backpack.
     */
    private set backpackContent(newContent: BackpackItemType[]) {
        this.data.backpack.contents = newContent;
    }

    /**
     * Finds an item in the player's backpack by name.
     * @param name - The name of the item to find.
     * @returns The found item or undefined.
     */
    public findItem(name: string) {
        return this.backpackContent.find(
            (item) => item.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Adds an item to the player's backpack.
     * @param item - The item to add.
     * @param amount - The amount of the item to add. Default is 1.
     * @returns The player instance.
     */
    public addItem(item: Item, amount: number = 1) {
        const foundItem = this.findItem(item.name);
        if (foundItem) foundItem.amount += amount;
        else
            this.backpackContent.push(
                new BackpackItem(
                    item.name,
                    item.size,
                    item.value,
                    item.weight,
                    item.buy,
                    item.sell,
                    item.canScavenge,
                    item.inLootbox,
                    amount
                )
            );
        return this;
    }

    /**
     * Adds an excess item to the player's excess items list.
     * If the backpack has enough free space, the item is added to the backpack.
     * Otherwise, the item is added to the excess items list.
     *
     * @param item - The item to add.
     * @param amount - The amount of the item to add. Default is 1.
     *
     * @returns {void}
     */
    public addItemExcess(item: Item, amount: number = 1) {
        const items = Array(amount).fill(item);
        for (const item of items) {
            if (this.backpack.getFreeSpace() < item.size) {
                this.addExcessItem(item);
            } else {
                this.addItem(item);
            }
        }
    }

    /**
     * Removes an item from the player's backpack.
     * @param item - The item to remove.
     * @param amount - The amount of the item to remove. Default is 1.
     * @returns The player instance.
     */
    public removeItem(item: Item, amount: number = 1) {
        const itm = this.backpackContent.find((itm) => itm.name === item.name)!;
        if (itm.amount > amount) {
            itm.amount -= amount;
        } else {
            this.backpackContent.splice(this.backpackContent.indexOf(itm), 1);
        }
        for (const i of this.excessItems) {
            console.log(this.backpack.getFreeSpace(), i.size);
            if (this.backpack.getFreeSpace() < i.size) continue;
            else this.addItem(i);
            this.excessItems.splice(this.excessItems.indexOf(i), 1);
        }
        return this;
    }

    /**
     * Gets the player's lootboxes.
     */
    public get lootboxes() {
        return this.data.lootboxes;
    }

    /**
     * Sets the player's lootboxes.
     */
    private set lootboxes(newLootboxes: Lootbox[]) {
        this.data.lootboxes = newLootboxes;
    }

    /**
     * Opens a lootbox and adds the item to the player's backpack.
     * @param lootbox - The lootbox to open.
     * @returns The player instance and the obtained item.
     */
    public openLootbox(this: Player, lootbox: Lootbox) {
        const item = lootbox.open();
        this.addItem(item);
        return { player: this, item };
    }

    /**
     * Gets the player's statistics.
     */
    public get statistics() {
        return this.data.statistics;
    }

    /**
     * Sets the player's statistics.
     */
    private set statistics(newStatistics: Statistic[]) {
        this.data.statistics = newStatistics;
    }

    /**
     * Adds a statistic to the player.
     * @param name - The name of the statistic.
     * @param amount - The amount to increase. Default is 1.
     */
    public addStatistic(name: string, amount: number = 1) {
        const statistic = this.statistics.find((s) => s.name === name);
        if (statistic) {
            statistic.amount += amount;
        } else {
            this.statistics.push({ name, amount });
        }

        return this;
    }

    /**
     * Gets the player's class.
     */
    public get class() {
        return this.data.class;
    }

    /**
     * Sets the player's class.
     */
    private set class(newClass: Class | null) {
        this.data.class = newClass;
    }

    /**
     * Gets the player's attributes.
     */
    public get attributes() {
        return this.data.attributes;
    }

    /**
     * Sets the player's attributes.
     */
    private set attributes(newAttributes: Attribute[]) {
        this.data.attributes = newAttributes;
    }

    /**
     * Gets a specific attribute by name.
     * @param attribute - The name of the attribute.
     * @returns The attribute object.
     */
    public getAttribute(attribute: string) {
        return this.attributes.find((a) => a.name === attribute);
    }

    /**
     * Increases a specific attribute.
     * @param attribute - The name of the attribute.
     * @param amount - The amount to increase.
     * @returns The player instance.
     */
    public increaseAttribute(attribute: string, amount: number = 1) {
        const attr = this.getAttribute(attribute);
        if (attr) attr.value = Math.min(10, attr.value + amount);
        return this;
    }

    /**
     * Decreases a specific attribute.
     * @param attribute - The name of the attribute.
     * @param amount - The amount to decrease.
     * @returns The player instance.
     */
    public decreaseAttribute(attribute: string, amount: number = 1) {
        const attr = this.getAttribute(attribute);
        if (attr) attr.value = Math.max(0, attr.value - amount);
        return this;
    }

    /**
     * Gets the player's strength attribute.
     */
    public get strength() {
        return this.attributes.find((a) => a.name === "Strength")!.value;
    }

    /**
     * Sets the player's strength attribute.
     */
    private set strength(value: number) {
        this.attributes.find((a) => a.name === "Strength")!.value = value;
    }

    /**
     * Gets the player's dexterity attribute.
     */
    public get dexterity() {
        return this.attributes.find((a) => a.name === "Dexterity")!.value;
    }

    /**
     * Sets the player's dexterity attribute.
     */
    private set dexterity(value: number) {
        this.attributes.find((a) => a.name === "Dexterity")!.value = value;
    }

    /**
     * Gets the player's intelligence attribute.
     */
    public get intelligence() {
        return this.attributes.find((a) => a.name === "Intelligence")!.value;
    }

    /**
     * Sets the player's intelligence attribute.
     */
    private set intelligence(value: number) {
        this.attributes.find((a) => a.name === "Intelligence")!.value = value;
    }

    /**
     * Gets the player's constitution attribute.
     */
    public get constitution() {
        return this.attributes.find((a) => a.name === "Constitution")!.value;
    }

    /**
     * Sets the player's constitution attribute.
     */
    private set constitution(value: number) {
        this.attributes.find((a) => a.name === "Constitution")!.value = value;
    }

    /**
     * Gets the player's charisma attribute.
     */
    public get charisma() {
        return this.attributes.find((a) => a.name === "Charisma")!.value;
    }

    /**
     * Sets the player's charisma attribute.
     */
    private set charisma(value: number) {
        this.attributes.find((a) => a.name === "Charisma")!.value = value;
    }

    /**
     * Gets the player's wisdom attribute.
     */
    public get wisdom() {
        return this.attributes.find((a) => a.name === "Wisdom")!.value;
    }

    /**
     * Sets the player's wisdom attribute.
     */
    private set wisdom(value: number) {
        this.attributes.find((a) => a.name === "Wisdom")!.value = value;
    }

    /**
     * Gets the player's available stat points.
     */
    public get statPoints() {
        return this.data.statPoints;
    }

    /**
     * Sets the player's available stat points.
     */
    private set statPoints(amount: number) {
        this.data.statPoints = amount;
    }

    /**
     * Checks if the player has any available stat points.
     */
    public get hasStatPoints() {
        return this.statPoints > 0;
    }

    /**
     * Gets the player's available prestige points.
     */
    public get prestigePoints() {
        return this.data.prestigePoints;
    }

    /**
     * Sets the player's available prestige points.
     */
    private set prestigePoints(amount: number) {
        this.data.prestigePoints = amount;
    }

    /**
     * Gets the player's prestige attributes.
     */
    public get prestigeAttributes() {
        return this.data.prestigeAttributes;
    }

    /**
     * Sets the player's prestige attributes.
     */
    private set prestigeAttributes(newAttributes: PrestigeAttribute[]) {
        this.data.prestigeAttributes = newAttributes;
    }

    /**
     * Gets a specific attribute by name.
     * @param attribute - The name of the attribute.
     * @returns The attribute object.
     */
    public getPrestigeAttribute(attribute: string) {
        return this.prestigeAttributes.find((a) => a.name === attribute);
    }

    /**
     * Increases a specific attribute.
     * @param attribute - The name of the attribute.
     * @param amount - The amount to increase.
     * @returns The player instance.
     */
    public increasePrestigeAttribute(attribute: string, amount: number = 1) {
        const attr = this.getPrestigeAttribute(attribute);
        if (attr) attr.value = Math.min(10, attr.value + amount);
        return this;
    }

    /**
     * Decreases a specific attribute.
     * @param attribute - The name of the attribute.
     * @param amount - The amount to decrease.
     * @returns The player instance.
     */
    public decreasePrestigeAttribute(attribute: string, amount: number = 1) {
        const attr = this.getPrestigeAttribute(attribute);
        if (attr) attr.value = Math.max(0, attr.value - amount);
        return this;
    }

    /**
     * Gets the player's experience boost attribute.
     */
    public get expBoost() {
        return (
            1 +
            this.prestigeAttributes.find((a) => a.name === "ExperienceBoost")!
                .value /
                10
        );
    }

    /**
     * Sets the player's experience boost attribute.
     */
    private set expBoost(amount: number) {
        this.prestigeAttributes.find(
            (a) => a.name === "ExperienceBoost"
        )!.value = amount;
    }

    /**
     * Gets the player's money boost attribute.
     */
    public get moneyBoost() {
        return (
            1 +
            this.prestigeAttributes.find((a) => a.name === "MoneyBoost")!
                .value /
                10
        );
    }

    /**
     * Sets the player's money boost attribute.
     */
    private set moneyBoost(amount: number) {
        this.prestigeAttributes.find((a) => a.name === "MoneyBoost")!.value =
            amount;
    }

    /**
     * Gets the player's equipment.
     */
    public get equipment() {
        return this.data.equipment;
    }

    /**
     * Sets the player's equipment.
     */
    private set equipment(newEquipment: Equipment) {
        this.data.equipment = newEquipment;
    }

    /**
     * Equips an item to the player.
     * @param item - The item to equip.
     * @returns The player instance.
     */
    public equip(
        item: Cuirass | Helmet | LegArmor | Shield | Weapon | BackpackEquipment
    ) {
        if (item instanceof Cuirass) {
            if (this.cuirass) this.unequip(this.cuirass);
            this.removeItem(item).cuirass = item;
        } else if (item instanceof Helmet) {
            if (this.helmet) this.unequip(this.helmet);
            this.removeItem(item).helmet = item;
        } else if (item instanceof LegArmor) {
            if (this.legArmor) this.unequip(this.legArmor);
            this.removeItem(item).legArmor = item;
        } else if (item instanceof Shield) {
            if (this.shield) this.unequip(this.shield);
            this.removeItem(item).shield = item;
        } else if (item instanceof Weapon) {
            if (this.weapon) this.unequip(this.weapon);
            this.removeItem(item).weapon = item;
        } else if (item instanceof BackpackEquipment) this.equipBackpack(item);
        return this;
    }

    /**
     * Unequips an item from the player.
     * @param item - The item to unequip.
     * @returns The player instance.
     */
    public unequip(
        item: Cuirass | Helmet | LegArmor | Shield | Weapon | BackpackEquipment
    ) {
        if (item instanceof Cuirass) this.addItem(item).cuirass = null;
        else if (item instanceof Helmet) this.addItem(item).helmet = null;
        else if (item instanceof LegArmor) this.addItem(item).legArmor = null;
        else if (item instanceof Shield) this.addItem(item).shield = null;
        else if (item instanceof Weapon) this.addItem(item).weapon = null;
        return this;
    }

    /**
     * Equips a backpack to the player.
     * @param item - The backpack equipment to equip.
     * @returns The player instance.
     */
    public equipBackpack(item: BackpackEquipment) {
        item.backpack.contents = this.backpackContent;
        const backpack = this.backpack;
        const bpItem = Object.values(items).find(
            (item) => item.name.toLowerCase() === backpack.name.toLowerCase()
        );
        if (bpItem) this.addItem(bpItem);
        this.backpack = item.backpack;
        this.removeItem(item);
        return this;
    }

    /**
     * Checks if the given item is armor.
     * @param item - The item to check.
     * @returns True if the item is armor, otherwise false.
     */
    public isArmor(item: Item | null) {
        return (
            item instanceof Helmet ||
            item instanceof Cuirass ||
            item instanceof LegArmor ||
            item instanceof Shield
        );
    }

    /**
     * Gets the player's weapon.
     */
    public get weapon() {
        return this.equipment.weapon;
    }

    /**
     * Sets the player's weapon.
     */
    private set weapon(newWeapon) {
        this.data.equipment.weapon = newWeapon;
    }

    /**
     * Gets the player's shield.
     */
    public get shield() {
        return this.equipment.shield;
    }

    /**
     * Sets the player's shield.
     */
    private set shield(newShield) {
        this.data.equipment.shield = newShield;
    }

    /**
     * Gets the player's helmet.
     */
    public get helmet() {
        return this.equipment.helmet;
    }

    /**
     * Sets the player's helmet.
     */
    private set helmet(newHelmet) {
        this.data.equipment.helmet = newHelmet;
    }

    /**
     * Gets the player's cuirass.
     */
    public get cuirass() {
        return this.equipment.cuirass;
    }

    /**
     * Sets the player's cuirass.
     */
    private set cuirass(newCuirass) {
        this.data.equipment.cuirass = newCuirass;
    }

    /**
     * Gets the player's leg armor.
     */
    public get legArmor() {
        return this.equipment.legArmor;
    }

    /**
     * Sets the player's leg armor.
     */
    private set legArmor(newLegArmor) {
        this.data.equipment.legArmor = newLegArmor;
    }

    /**
     * Gets the player's premium status.
     */
    public get premium() {
        return this.data.premium;
    }

    /**
     * Sets the player's premium status.
     */
    private set premium(newPremium: boolean) {
        this.data.premium = newPremium;
    }

    /**
     * Sets the player's premium status.
     *
     * @param boolean - The new premium status.
     * @returns The player instance for method chaining.
     */
    public setPremium(boolean: boolean) {
        this.premium = boolean;
        return this;
    }

    /**
     * Gets the player's pity items.
     */
    public get pity() {
        return this.data.pity;
    }

    /**
     * Sets the player's pity items.
     */
    private set pity(newPity: PityItem[]) {
        this.data.pity = newPity;
    }

    /**
     * Finds a pity value by item name.
     * @param pity - The name of the item.
     * @returns The pity value.
     */
    public findPity(pity: string) {
        return this.pity.find(
            (p) => p.item.name.toLowerCase() === pity.toLowerCase()
        )?.pity;
    }

    /**
     * Increases the pity count for a specified item.
     * @param name - The name of the item.
     * @param amount - The amount to increase.
     * @returns The player instance.
     */
    public increasePity(name: string, amount: number) {
        const pity = this.pity.find(
            (p) => p.item.name.toLowerCase() === name.toLowerCase()
        );
        const item = Object.values(items).find(
            (i) => i.name.toLowerCase() === name.toLowerCase()
        );
        if (!item) return this;
        if (pity) pity.pity += amount;
        else this.pity.push({ item, pity: amount });
        return this;
    }

    /**
     * Increases pity for all items except the specified item.
     * @param name - The name of the item to exclude.
     * @returns The player instance.
     */
    public increasePities(name: string) {
        for (const pity of this.pity) {
            const item = Object.values(items).find(
                (i) => i.name.toLowerCase() === pity.item.name.toLowerCase()
            );
            if (pity.item.name.toLowerCase() === name.toLowerCase()) continue;
            if (item && item.weight <= 0) continue;
            pity.pity += getPityNumberIncrease(pity.item, this.pity);
        }
        return this;
    }

    /**
     * Resets the pity value for a specified item.
     * @param name - The name of the item.
     * @returns The player instance.
     */
    public resetPity(name: string) {
        const pity = this.pity.find(
            (p) => p.item.name.toLowerCase() === name.toLowerCase()
        );
        if (!pity) return this;
        pity.pity = 0;
        return this;
    }

    /**
     * Removes a pity item from the player's pity items list.
     *
     * @param name - The name of the item to remove.
     * @returns The player instance for method chaining.
     */
    public removePity(name: string) {
        const pity = this.pity.find(
            (p) => p.item.name.toLowerCase() === name.toLowerCase()
        );
        if (!pity) return this;
        this.pity.splice(this.pity.indexOf(pity), 1);
        return this;
    }

    /**
     * Retrieves the player's excess items.
     *
     * @returns {Item[]} The player's excess items.
     */
    public get excessItems(): Item[] {
        return this.data.excessItems;
    }

    /**
     * Sets the player's excess items.
     *
     * @param {Item[]} items - The new excess items to set.
     */
    private set excessItems(items: Item[]) {
        this.data.excessItems = items;
    }

    /**
     * Adds an excess item to the player's excess items list.
     *
     * @param item - The item to add to the excess items list.
     * @returns The player instance for method chaining.
     */
    public addExcessItem(item: Item) {
        this.excessItems.push(item);
        return this;
    }

    /**
     * Gets the player's total damage.
     */
    public get damage() {
        return (
            Math.floor(
                Array.from(this.equipment)
                    .filter((item) => item !== null)
                    .reduce((acc, item) => acc + (item as Weapon).damage, 0) *
                    (1 + this.strength / 20)
            ) || 0
        );
    }

    /**
     * Gets the player's total armor value.
     */
    public get armor() {
        return (
            Math.floor(
                Array.from(this.equipment)
                    .filter((item) => item !== null)
                    .reduce(
                        (acc, item) => acc + (item as ArmorItemType).armor,
                        0
                    ) *
                    (1 + this.dexterity / 10)
            ) || 0
        );
    }

    /**
     * Gets the player's total health points.
     */
    public get health() {
        return Math.round(
            7 +
                (7 * this.data.level + this.data.level) +
                1.33 * this.data.prestige +
                2.5 * this.constitution
        );
    }

    // INTERNAL FUNCTIONS - EDIT WITH CARE!

    /**
     * Retrieves a player by their ID.
     * @param id - The unique identifier of the player.
     * @param client - The Discord client instance.
     * @returns The player instance.
     */
    public static async get(id: string, client: Client): Promise<Player> {
        const user = await client.users.fetch(id);
        const player = new Player(id, user.username);

        if (user.bot) return player;

        const cacheManager = PlayerSaveManager.getInstance();
        const cachedPlayer = cacheManager.getPlayerFromCache(id);
        if (cachedPlayer) {
            return cachedPlayer;
        }

        const playerData = await db.ensure(id, player.toJSON());
        const fetchedPlayer = Player.fromJSON(playerData);

        cacheManager.cachePlayer(fetchedPlayer);

        return fetchedPlayer;
    }

    /**
     * Retrieves a player by their ID from the database.
     * @param id - The unique identifier of the player.
     * @returns The player instance.
     */
    public static async getFromID(id: string) {
        const player = await db.get(id);
        if (!player) return new Player(id, "Unknown");
        else return Player.fromJSON(player);
    }

    /**
     * Creates a player instance from a JSON object.
     * @param object - The JSON object representing the player.
     * @returns The player instance.
     */
    public static fromJSON(object: Player.JSON) {
        return new Player(object.id, object.name, object.data);
    }

    /**
     * Converts the player instance to a JSON object.
     * @returns The JSON representation of the player.
     */
    public toJSON() {
        return {
            id: this.id,
            name: this.name,
            data: this.data,
        };
    }

    public async save() {
        await PlayerSaveManager.getInstance().save(this);
    }

    /**
     * Saves the player instance to the database.
     * @returns A promise resolving to the saved player data.
     */
    public async saveToDatabase() {
        return db.set(this.id, this.toJSON());
    }
}

/**
 * Namespace for the Player class containing interfaces.
 */
export namespace Player {
    /**
     * Represents the JSON structure of a player.
     */
    export interface JSON {
        id: string;
        name: string;
        data: Data;
    }

    /**
     * Represents the data structure of a player.
     */
    export interface Data {
        balance: number;
        xp: number;
        level: number;
        prestige: number;
        backpack: Backpack;
        lootboxes: Lootbox[];
        statistics: Statistic[];
        class: Class | null;
        attributes: Attribute[];
        statPoints: number;
        prestigePoints: number;
        prestigeAttributes: PrestigeAttribute[];
        equipment: Equipment;
        premium: boolean;
        pity: PityItem[];
        excessItems: Item[];
    }
}
