import { CraftableItem } from "./CraftableItem.js";
import type { Recipe } from "./Recipe.js";

/**
 * Represents a craftable weapon item in a game.
 * Extends the base `CraftableItem` class.
 */
export class Weapon extends CraftableItem {
    type: string[];
    damage: number;
    attributes: string[];

    /**
     * Constructs a new instance of the Weapon class.
     *
     * @param name - The name of the weapon.
     * @param size - The size of the weapon.
     * @param value - The value of the weapon.
     * @param weight - The weight of the weapon.
     * @param recipe - The recipe required to craft the weapon.
     * @param type - The type(s) of weapon (e.g., "leather", "chainmail").
     * @param damage - The damage value of the weapon.
     * @param attributes - The attributes granted by the weapon.
     */
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        recipe: Recipe,
        type: string[],
        damage: number,
        attributes: string[]
    ) {
        super(name, size, value, weight, recipe);
        this.type = type;
        this.damage = damage;
        this.attributes = attributes;
    }
}
