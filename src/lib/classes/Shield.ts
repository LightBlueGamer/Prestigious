/**
 * Represents a shield in a game.
 *
 * @class Shield
 * @property {string} name - The name of the shield.
 * @property {string[]} type - The types of the shield (e.g., wooden, metal).
 * @property {number} armor - The amount of armor points the shield provides.
 * @property {string[]} attributes - Additional attributes of the shield.
 */
export class Shield {
    name: string;
    type: string[];
    armor: number;
    attributes: string[];

    /**
     * Creates an instance of Shield.
     *
     * @param {string} name - The name of the shield.
     * @param {string[]} type - The types of the shield (e.g., wooden, metal).
     * @param {number} armor - The amount of armor points the shield provides.
     * @param {string[]} attributes - Additional attributes of the shield.
     * @memberof Shield
     */
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
