import { CraftableItem } from "./CraftableItem.js";
import type { Recipe } from "./Recipe.js";

/**
 * Represents a craftable helmet item in a game.
 * Extends the base `CraftableItem` class.
 */
export class Helmet extends CraftableItem {
    type: string[];
    armor: number;
    attributes: string[];

    /**
     * Constructs a new instance of the Helmet class.
     *
     * @param name - The name of the helmet.
     * @param size - The size of the helmet.
     * @param value - The value of the helmet.
     * @param weight - The weight of the helmet.
     * @param recipe - The recipe required to craft the helmet.
     * @param type - The type(s) of helmet (e.g., "leather", "chainmail").
     * @param armor - The armor value of the helmet.
     * @param attributes - The attributes granted by the helmet.
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
