import sortArray from "sort-array";
import { client } from "../../bot";
import { players } from "../../database/main";
import { daily, messaging } from "../../game/loottables";
import { InventoryItem } from "./InventoryItem";
import { lootboxReward } from "../../game/rewards";
import type { Badge } from "./Badge";
import type { Item } from "./Item";
import { Clan } from "./Clan";
import { useables } from "../misc/useables";
import * as boosters from "../../game/boosters";
import * as containers from '../../game/containers';

export class Player {
    tag: string;
    id: string;
    prestige: number;
    level: number;
    xp: number;
    coins: number;
    inventory: Player.Inventory;
    badges: Player.Badges;
    joined: number;
    daily: number;
    messages: number;
    ping: boolean;
    color: string;
    displayName: string;
    boosts: Player.Boosts;
    constructor(
        tag: string, 
        id: string, 
        prestige = 0, 
        level = 1, 
        xp = 0, 
        coins = 0,
        inventory: Player.Inventory = [],
        badges: Player.Badges = [],
        joined = Date.now(),
        daily = Date.now(),
        messages = 0,
        ping = false,
        color = 'random',
        displayName = '',
        boosts: Player.Boosts = {
            xp: [],
            coins: [],
        }
    ) {
        this.tag = tag;
        this.id = id;
        this.prestige = prestige;
        this.level = level;
        this.xp = xp;
        this.coins = coins;
        this.inventory = inventory;
        this.badges = badges;
        this.joined = joined;
        this.daily = daily;
        this.messages = messages;
        this.ping = ping;
        this.color = color;
        this.displayName = displayName;
        this.boosts = boosts;
    }

    toJSON() {
        return {
            tag: this.tag,
            id: this.id,
            prestige: this.prestige,
            level: this.level,
            xp: this.xp,
            coins: this.coins,
            inventory: this.inventory,
            badges: this.badges,
            joined: this.joined,
            daily: this.daily,
            messages: this.messages,
            ping: this.ping,
            color: this.color,
            displayName: this.displayName,
            boosts: this.boosts,
        };
    }

    static fromJSON(object: Player.JSON) {
        return new Player(
            object.tag,
            object.id,
            object.prestige,
            object.level,
            object.xp,
            object.coins,
            object.inventory,
            object.badges,
            object.joined,
            object.daily,
            object.messages,
            object.ping,
            object.color,
            object.displayName,
            object.boosts,
        );
    }

    getName() {
        return this.displayName.length > 0 ? this.displayName : this.tag.slice(0, -5);
    }

    requiredXp() {
        return (100 * Math.ceil(this.level / 10)) * this.level;
    }

    levelUp() {
        const requiredXp = this.requiredXp();
        if (this.xp >= requiredXp) return this.xp -= requiredXp, this.level++, `You leveled up to level ${this.level}!`;
        return;
    }

    async addXp(multiplier = 1) {
        const clan = await Clan.getFromUser(this.id);
        const member = clan?.getMember(this.id);
        const clanMult = clan?.stats.xpMultiplier || 1;
        const autoContribution = clan?.getMember(this.id)?.autoContribute.xp || 0;
        const booster = this.boosts.xp.reduce((a, b) => a + b.amount, 0) - 1;
        const xp = Math.floor((Math.floor(Math.random() * (25 - 10)) + 10) * (multiplier + (clanMult - 1) + booster));
        if(autoContribution > 0) await clan?.addXp(member!, Math.floor(xp * autoContribution))
        await clan?.save();
        const rest = Math.floor(xp - (xp * autoContribution));
        this.xp += rest;
        return this.levelUp();
    }

    async addCoins(multiplier = 1) {
        const clan = await Clan.getFromUser(this.id);
        const member = clan?.getMember(this.id);
        const clanMult = clan?.stats.coinMultiplier || 1;
        const autoContribution = clan?.getMember(this.id)?.autoContribute.coins || 0;
        const booster = this.boosts.coins.reduce((a, b) => a + b.amount, 0) - 1;
        const coins = Math.floor((Math.floor(Math.random() * (50 - 25)) + 25) * (multiplier + (clanMult - 1) + booster));
        if(autoContribution > 0) await clan?.deposit(member!, Math.floor(coins * autoContribution));
        clan?.save();
        const rest = Math.floor(coins - (coins * autoContribution));
        this.addSetCoins(rest);
        return Math.floor(rest);
    }

    addSetCoins(amount: number) {
        return this.coins += amount, this.coins;
    }

    removeCoins(amount: number) {
        if(this.coins - amount < 0) return;
        return this.coins -= amount, this.coins;
    }

    incPrestige() {
        if(this.level === 100) return this.level = 1, this.xp = 0, this.prestige++;
        return;
    }
    
    getDaily() {
        const now = Date.now();
        if(this.daily - now <= 0) {
            const reward = daily.generateReward();
            this.daily = now + (1000 * 60 * 60 * 24);
            return this.addItem(reward, 2), `You received a ${reward.name} from your daily reward!`;
        }

        return `You can't claim your daily reward yet! Your next daily reward can be opened <t:${Math.floor(this.daily / 1000)}:R>.`;
    }

    addItem(item: Item, amount: number) {
        const inventoryItem = this.inventory.find(i => i.name === item.name);
        if(inventoryItem) return inventoryItem.amount += amount, this.inventory;
        else return this.inventory.push(new InventoryItem(item.name, item.rarity, amount, item.type)), this.inventory;
    }

    removeItem(item: Item, amount: number) {
        const inventoryItem = this.inventory.find(i => i.name === item.name);
        if(!inventoryItem) return false
        if(inventoryItem.amount - amount <= 0) return this.inventory.splice(this.inventory.indexOf(inventoryItem), 1), this.inventory.length;
        else return inventoryItem.amount -= amount;
    }

    getItem(name: string) {
        return this.inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
    }

    messagingReward() {
        const loot = Math.floor(Math.random() * (1000)) + 1;
        if(loot <= this.messages) {
            this.messages = 0;
            const item = messaging.generateReward();
            this.addItem(item, 1);
            return `You received a ${item.name}!`;
        }
        
        return;
    }

    getInventory(page: number) {
        const items = this.inventory;
        if (page * 50 > items.length) page = Math.ceil(items.length / 50);
        if (page <= 0) page = 1;
        return sortArray(items, {
            by: 'comp',
            order: 'rarity',
            customOrders: {
                rarity: ['Unique', 'Artifact', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common']
            },
            computed: {
                comp: (row) => row.rarity.name,
            },
        }).slice((page - 1) * 50, (page - 1) * 50 + 50);
    }

    vote() {
        this.addItem(lootboxReward, 1);
        client.users.fetch(this.id).then(user => {
            return user.send(`You have voted and received 2x lootboxes!`);
        });
        return true;
    }

    setExpBoost(amount: number, duration: number) {
        const boost = this.boosts.xp.find(boost => boost.amount === amount);
        if(boost) {
            boost.duration += duration;
        } else {
            this.boosts.xp.push({
                amount,
                duration: Date.now() + duration,
            });
        }
        return this.boosts.xp;
    }

    setCoinBoost(amount: number, duration: number) {
        const boost = this.boosts.coins.find(boost => boost.amount === amount);
        if(boost) {
            boost.duration += duration;
        } else {
            this.boosts.coins.push({
                amount,
                duration: Date.now() + duration,
            });
        }
        return this.boosts.coins;
    }

    checkBoosters() {
        this.boosts.xp.forEach(boost => {
            if(boost.duration - Date.now() <= 0) this.boosts.xp.splice(this.boosts.xp.indexOf(boost), 1);
        });

        this.boosts.coins.forEach(boost => {
            if(boost.duration - Date.now() <= 0) this.boosts.coins.splice(this.boosts.coins.indexOf(boost), 1);
        });

        return this.boosts;
    }

    useItem(item: Item) {
        const inventoryItem = this.inventory.find(i => i.name === item.name);
        if(!inventoryItem) return false;
        if(!useables.includes(inventoryItem.type)) return false;
        if(inventoryItem.type === 'Booster') {
            const booster = Object.values(boosters).find(b => b.name === inventoryItem.name);
            if(!booster) return false;
            if(booster.type === 'xp') this.setExpBoost(booster.multiplier, booster.duration);
            if(booster.type === 'coins') this.setCoinBoost(booster.multiplier, booster.duration);
        } else if (inventoryItem.type === 'Container') {
            const container = Object.values(containers).find(c => c.name === inventoryItem.name);
            if(!container) return false;
            container.use(this);
        }

        if(inventoryItem.amount - 1 <= 0) return this.removeItem(item, 1), this.inventory;
        else return inventoryItem.amount -= 1, this.inventory;
    }

    static async get(id: string) {
        const user = await client.users.fetch(id);
        const defaultPlayer = new Player(user.tag, id);
        const dbPlayer = await players.ensure(id, defaultPlayer.toJSON());
        return Player.fromJSON(dbPlayer);
    }

    async save() {
        return players.set(this.id, this.toJSON());
    }
}

export namespace Player {
    export interface JSON {
        tag: string;
        id: string;
        prestige: number;
        level: number;
        xp: number;
        coins: number;
        inventory: Inventory;
        badges: Badges;
        joined: number;
        daily: number;
        messages: number;
        ping: boolean;
        color: string;
        displayName: string;
        boosts: Boosts;
    }

    export interface Boosts {
        xp: Boost[],
        coins: Boost[],
    }

    export interface Boost {
        amount: number;
        duration: number;
    }

    export type Inventory = InventoryItem[];
    
    export type Badges = Badge[];
}