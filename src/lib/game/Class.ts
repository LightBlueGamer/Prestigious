/**
 * Represents a character class in a role-playing game.
 *
 * @class Class
 * @property {string} name - The name of the class.
 * @property {string[]} attributes - The attributes associated with the class.
 * @property {string[]} proficiencies - The proficiencies associated with the class.
 * @property {number} experience - The experience points earned by the character.
 *
 * @constructor
 * @param {string} name - The name of the class.
 * @param {string[]} attributes - The attributes associated with the class.
 * @param {string[]} proficiencies - The proficiencies associated with the class.
 * @param {number} [experience=0] - The experience points earned by the character. Default is 0.
 */
export class Class {
    name: string;
    attributes: string[];
    proficiencies: string[];
    experience: number;
    constructor(
        name: string,
        attributes: string[],
        proficiencies: string[],
        experience: number = 0
    ) {
        this.name = name;
        this.attributes = attributes;
        this.proficiencies = proficiencies;
        this.experience = experience;
    }
}