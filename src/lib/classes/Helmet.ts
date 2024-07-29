/**
 * Represents a helmet with its properties.
 *
 * @class Helmet
 * @constructor
 * @param {string} name - The name of the helmet.
 * @param {string[]} type - The types of the helmet (e.g., "leather", "chainmail").
 * @param {number} defense - The defense value of the helmet.
 * @param {string[]} attributes - The attributes of the helmet (e.g., "fire resistance", "water resistance").
 */
export class Helmet {
    name: string;
    type: string[];
    defense: number;
    attributes: string[];
    constructor(
        name: string, 
        type: string[], 
        defense: number, 
        attributes: string[]
    ) {
        this.name = name;
        this.type = type;
        this.defense = defense;
        this.attributes = attributes;
    }
}