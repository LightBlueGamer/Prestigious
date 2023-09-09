/**
 * The base class for rarities
 * @param name The name of the rarity
 * @param rarity The number representing the rarity
 * @returns Rarity
 */
export class Rarity {
    name: string;
    rarity: number;
    constructor(name: string, rarity: number) {
        this.name = name;
        this.rarity = rarity;
    }
}

export const Rarities = {
    Starter: {
        name: "Starter",
        rarity: 0,
    },
    VeryCommon: {
        name: "Very Common",
        rarity: 1,
    },
    Common: {
        name: "Common",
        rarity: 2,
    },
    Uncommon: {
        name: "Uncommon",
        rarity: 3,
    },
    Rare: {
        name: "Rare",
        rarity: 4,
    },
    VeryRare: {
        name: "Very Rare",
        rarity: 5,
    },
    ExtremelyRare: {
        name: "Extremely Rare",
        rarity: 6,
    },
    Epic: {
        name: "Epic",
        rarity: 7,
    },
    Legendary: {
        name: "Legendary",
        rarity: 8,
    },
};
