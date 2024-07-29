import { Recipe } from "../classes/Recipe.js";
import { items } from "./items.js";

export const recipes = {
    StoneHatchet: new Recipe(items.StoneHatchetItem, [
        items.Rock,
        items.Fibers,
        items.Stick,
    ]),
};
