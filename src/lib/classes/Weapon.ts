/**
 * Represents a weapon in a game.
 *
 * @class Weapon
 * @property {string} name - The name of the weapon.
 * @property {string[]} type - The types of the weapon (e.g., sword, bow, staff).
 * @property {number} damage - The base damage of the weapon.
 * @property {string[]} attributes - The attributes of the weapon (e.g., magical, poison).
 */
export class Weapon {
    name: string;
    type: string[];
    damage: number;
    attributes: string[];

    /**
     * Creates an instance of Weapon.
     *
     * @param {string} name - The name of the weapon.
     * @param {string[]} type - The types of the weapon (e.g., sword, bow, staff).
     * @param {number} damage - The base damage of the weapon.
     * @param {string[]} attributes - The attributes of the weapon (e.g., magical, poison).
     * @memberof Weapon
     */
    constructor(
        name: string,
        type: string[],
        damage: number,
        attributes: string[]
    ) {
        this.name = name;
        this.type = type;
        this.damage = damage;
        this.attributes = attributes;
    }
}