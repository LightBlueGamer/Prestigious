/**
 * Represents a piece of armor in a fantasy game.
 *
 * @class Cuirass
 * @property {string} name - The name of the cuirass.
 * @property {string[]} type - The types of armor this cuirass belongs to.
 * @property {number} armor - The amount of armor points this cuirass provides.
 * @property {string[]} attributes - The attributes or effects this cuirass has.
 *
 * @constructor
 * @param {string} name - The name of the cuirass.
 * @param {string[]} type - The types of armor this cuirass belongs to.
 * @param {number} armor - The amount of armor points this cuirass provides.
 * @param {string[]} attributes - The attributes or effects this cuirass has.
 */
export class Cuirass {
    name: string;
    type: string[];
    armor: number;
    attributes: string[];
    constructor(
        name: string,
        type: string[],
        armor: number,
        attributes: string[]
    ) {
        this.name = name;
        this.type = type;
        this.armor = armor;
        this.attributes = attributes;
    }
}
