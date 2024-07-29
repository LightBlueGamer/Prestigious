import type { Ingredient } from "./Ingredient.js";
import type { Item } from "./Item.js";
import type { RecipeResult } from "./RecipeResult.js";

/**
 * Represents a recipe that can produce an item or a recipe result.
 *
 * @class Recipe
 */
export class Recipe {
    /**
     * The item or recipe result that the recipe produces.
     *
     * @type {Item | RecipeResult}
     */
    result: Item | RecipeResult;

    /**
     * The list of ingredients required to create the recipe result.
     *
     * @type {(Ingredient | Item)[]}
     */
    ingredients: (Ingredient | Item)[];

    /**
     * Constructs a new instance of the Recipe class.
     *
     * @param {Item | RecipeResult} result - The item or recipe result that the recipe produces.
     * @param {(Ingredient | Item)[]} ingredients - The list of ingredients required to create the recipe result.
     */
    constructor(
        result: Item | RecipeResult,
        ingredients: (Ingredient | Item)[]
    ) {
        this.result = result;
        this.ingredients = ingredients;
    }
}
