import { Recipe } from "../classes/Recipe";
import { items } from "./items";

export const recipes = {
    StoneHatchet: new Recipe(items.StoneHatchetItem, [
        items.Rock,
        items.Fibers,
        items.Stick
    ])
}