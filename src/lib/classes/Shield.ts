import { CraftableItem } from "./CraftableItem.js";
import type { Recipe } from "./Recipe.js";

/**
 * Represents a craftable shield item in a game.
 * Extends the base `CraftableItem` class.
 */
export class Shield extends CraftableItem {
    type: string[];
    armor: number;
    attributes: string[];

    /**
     * Constructs a new instance of the Shield class.
     *
     * @param name - The name of the shield.
     * @param size - The size of the shield.
     * @param value - The value of the shield.
     * @param weight - The weight of the shield.
     * @param recipe - The recipe required to craft the shield.
     * @param type - The type(s) of shield (e.g., "leather", "chainmail").
     * @param armor - The armor value of the shield.
     * @param attributes - The attributes granted by the shield.
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
