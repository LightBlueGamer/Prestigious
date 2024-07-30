import { CraftableItem } from "./CraftableItem.js";
import type { Recipe } from "./Recipe.js";

/**
 * Represents a craftable cuirass item in a game.
 * Extends the base `CraftableItem` class.
 */
export class Cuirass extends CraftableItem {
    type: string[];
    armor: number;
    attributes: string[];

    /**
     * Constructs a new instance of the `Cuirass` class.
     *
     * @param name - The name of the cuirass.
     * @param size - The size of the cuirass.
     * @param value - The value of the cuirass.
     * @param weight - The weight of the cuirass.
     * @param recipe - The recipe required to craft the cuirass.
     * @param type - The type(s) of cuirass (e.g., "light", "heavy").
     * @param armor - The armor rating of the cuirass.
     * @param attributes - The attributes granted by the cuirass.
     */
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        recipe: Recipe,
        type: string[],
        armor: number,
        attributes: string[]
    ) {
        super(name, size, value, weight, recipe);
        this.type = type;
        this.armor = armor;
        this.attributes = attributes;
    }
}
