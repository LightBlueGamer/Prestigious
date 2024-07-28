import { recipes } from "../resources/recipes";
import type { Recipe } from "./Recipe";
import { RecipeResult } from "./RecipeResult";

/**
 * Represents an item in the game.
 *
 * @constructor
 * @param {string} name - The name of the item.
 * @param {number} size - The size of the item.
 * @param {number} value - The value of the item.
 * @param {number} weight - The weight of the item.
 * @param {boolean} [buy=true] - Whether the item can be bought.
 * @param {boolean} [sell=true] - Whether the item can be sold.
 * @param {boolean} [canScavenge=true] - Whether the item can be scavenged.
 * @param {boolean} [inLootbox=true] - Whether the item can be found in a lootbox.
 */
export class Item {
    name: string;
    size: number;
    value: number;
    weight: number;
    buy: boolean;
    sell: boolean;
    canScavenge: boolean;
    inLootbox: boolean;
    constructor(
        name: string,
        size: number,
        value: number,
        weight: number,
        buy: boolean = true,
        sell: boolean = true,
        canScavenge: boolean = true,
        inLootbox: boolean = true
    ) {
        this.name = name;
        this.size = size;
        this.value = value;
        this.weight = weight;
        this.buy = buy;
        this.sell = sell;
        this.canScavenge = canScavenge;
        this.inLootbox = inLootbox;
    }

    /**
     * Checks if the current item can be crafted using any available recipe.
     *
     * @returns {boolean} - Returns `true` if the item can be crafted, `false` otherwise.
     *
     * @remarks
     * This function iterates through all available recipes and checks if the item's name matches
     * the result item's name (case-insensitive). It supports both `Item` and `RecipeResult` types as recipe results.
     *
     * @example
     * ```typescript
     * const item = new Item("Stone Hatchet", 1, 10, 5);
     * console.log(item.isCraftable()); // Output: true (if there's a recipe that crafts a "Stone Hatchet")
     * ```
     */
    isCraftable(): boolean {
        return Object.values(recipes).some((recipe: Recipe) => {
            if(recipe.result instanceof Item) return recipe.result.name.toLowerCase() === this.name.toLowerCase();
            else if(recipe.result instanceof RecipeResult) return recipe.result.item.name.toLowerCase() === this.name.toLowerCase();
            return false;
        })
    }
}
