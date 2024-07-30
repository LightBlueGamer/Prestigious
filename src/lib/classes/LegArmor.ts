import { CraftableItem } from "./CraftableItem.js";
import type { Recipe } from "./Recipe.js";

/**
 * Represents a craftable legarmor item in a game.
 * Extends the base `CraftableItem` class.
 */
export class LegArmor extends CraftableItem {
    type: string[];
    armor: number;
    attributes: string[];

    /**
     * Constructs a new instance of the LegArmor class.
     *
     * @param name - The name of the legarmor.
     * @param size - The size of the legarmor.
     * @param value - The value of the legarmor.
     * @param weight - The weight of the legarmor.
     * @param recipe - The recipe required to craft the legarmor.
     * @param type - The type(s) of legarmor (e.g., "leather", "chainmail").
     * @param armor - The armor value of the legarmor.
     * @param attributes - The attributes granted by the legarmor.
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
