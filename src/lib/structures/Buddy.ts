export class Buddy {
    name?: string;
    health?: number;
    maxHealth?: number;
    stamina?: number;
    maxStamina?: number;
    level?: number;
    xp?: number;
    constructor(
        name?: string,
        health?: number, 
        maxHealth?: number,
        stamina?: number, 
        maxStamina?: number,
        level: number = 1,
        xp: number = 0,
    )
     {
        this.name = name;
        this.health = health;
        this.maxHealth = maxHealth;
        this.stamina = stamina;
        this.maxStamina = maxStamina;
        this.level = level;
        this.xp = xp;
    }

    requiredXp() {
        return Math.floor(this.level! * 100);
    }

    canLevelUp() {
        return this.xp! >= this.requiredXp();
    }

    hasDied() {
        return this.health! <= 0;
    }

    hasFainted() {
        return this.stamina! <= 0;
    }
    
    walk(amount: number) {
        for(let i=0; i<amount; i++) {

        }
    }

    encounter() {
        const random = Math.floor(Math.random() * 100);
        if(random <= 30) {
            return true;
        } else {
            return false;
        }
    }
}

export namespace Buddy {
    export class Snack {
        name: string;
        type: Snack.Type;
        amount: number;
        constructor(
            name: string,
            type: Snack.Type,
            amount: number,
        ) {
            this.name = name;
            this.type = type;
            this.amount = amount;
        }
    }
}

export namespace Snack {
    export type Type = 'Health' | 'Energy';
}