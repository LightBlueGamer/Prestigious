/**
 * Represents a piece of leg armor with its attributes.
 *
 * @class LegArmor
 * @constructor
 * @param {string} name - The name of the leg armor.
 * @param {string[]} type - The types of the leg armor (e.g., 'plate', 'chainmail', 'leather').
 * @param {number} armor - The armor value of the leg armor.
 * @param {string[]} attributes - The attributes of the leg armor (e.g., 'fire resistance', 'cold resistance').
 */
export class LegArmor {
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
