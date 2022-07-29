import type { Badge } from "./Badge";
import type { InventoryItem } from "./InventoryItem";

export class Player {
    tag: string;
    id: string;
    prestige: number;
    level: number;
    xp: number;
    coins: number;
    inventory: Player.Inventory;
    badges: Player.Badges;
    constructor(
        tag: string, 
        id: string, 
        prestige: number, 
        level: number, 
        xp: number, 
        coins: number,
        inventory: Player.Inventory,
        badges: Player.Badges
    ) {
        this.tag = tag;
        this.id = id;
        this.prestige = prestige;
        this.level = level;
        this.xp = xp;
        this.coins = coins;
        this.inventory = inventory;
        this.badges = badges;
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
        };
    }

    fromJSON(object: Player) {
        return new Player(
            object.tag,
            object.id,
            object.prestige,
            object.level,
            object.xp,
            object.coins,
            object.inventory,
            object.badges
        );
    }
}

export namespace Player {
    export type Inventory = InventoryItem[];
    export type Badges = Badge[];
}