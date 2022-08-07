import sortArray from "sort-array";
import { client } from "../../bot";
import { players } from "../../database/main";
import { daily, messaging } from "../../game/loottables";
import { InventoryItem } from "./InventoryItem";
import { lootboxReward } from "../../game/rewards";

export class Player {
    tag;
    id;
    prestige;
    level;
    xp;
    coins;
    inventory;
    badges;
    joined;
    daily;
    messages;
    ping;
    constructor(
        tag, 
        id, 
        prestige = 0, 
        level = 1, 
        xp = 0, 
        coins = 0,
        inventory = [],
        badges = [],
        joined = Date.now(),
        daily = Date.now(),
        messages = 0,
        ping = false,
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
        };
    }

    static fromJSON(object) {
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
        );
    }

    requiredXp() {
        return (100 * Math.ceil(this.level / 10)) * this.level;
    }

    levelUp() {
        const requiredXp = this.requiredXp();
        if (this.xp >= requiredXp) return this.xp -= requiredXp, this.level++, `You leveled up to level ${this.level}!`;
        else return false;
    }

    addXp(multiplier = 1) {
        const xp = Math.floor(Math.random() * (25 - 10)) + 10;
        this.xp += xp * multiplier;
        return this.levelUp();
    }

    addCoins(multiplier = 1) {
        const coins = Math.floor(Math.random() * (50 - 20)) + 20;
        this.coins += coins * multiplier;
        return this.coins;
    }

    incPrestige() {
        if(this.level === 100) return this.level = 1, this.xp = 0, this.prestige++;
        else return false;
    }
    
    getDaily() {
        const now = Date.now();
        if(this.daily - now <= 0) {
            const reward = daily.generateReward();
            this.daily = now + (1000 * 60 * 60 * 24);
            return this.addItem(reward, 1), `You received a ${reward.name} from your daily reward!`;
        }

        return `You can't claim your daily reward yet! Your next daily reward can be opened <t:${Math.floor(this.daily / 1000)}:R>.`;
    }

    addItem(item, amount) {
        const inventoryItem = this.inventory.find(i => i.name === item.name);
        if(inventoryItem) return inventoryItem.amount += amount;
        else return this.inventory.push(new InventoryItem(item.name, item.rarity, amount, item.type));
    }

    removeItem(item, amount) {
        const inventoryItem = this.inventory.find(i => i.name === item.name);
        if(!inventoryItem) return false
        if(inventoryItem.amount - amount <= 0) return this.inventory.splice(this.inventory.indexOf(inventoryItem), 1), this.inventory.length;
        else return inventoryItem.amount -= amount;
    }

    getItem(name) {
        return this.inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
    }

    messagingReward() {
        const loot = Math.floor(Math.random() * (1000)) + 1;
        if(loot === this.messages) {
            this.messages = 0;
            const item = messaging.generateReward();
            this.addItem(item, 1);
            return `You received a ${item.name}!`;
        }
        
        return false;
    }

    getInventory(page) {
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
        this.addItem(lootboxReward, 2);
        client.users.fetch(this.id).then(user => {
            return user.send(`You have voted and received 2x lootboxes!`);
        });
    }

    static async get(id) {
        const user = await client.users.fetch(id);
        const defaultPlayer = new Player(user.tag, id);
        const dbPlayer = await players.ensure(id, defaultPlayer.toJSON());
        return Player.fromJSON(dbPlayer);
    }

    async save() {
        return players.set(this.id, this.toJSON());
    }
}