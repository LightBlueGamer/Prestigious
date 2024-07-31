import { Weapon } from "../classes/Weapon.js";
import { items } from "./items.js";
import { recipes } from "./recipes.js";

items.StoneHatchetItem = new Weapon(
    "Stone Hatchet",
    2,
    225,
    0,
    recipes.StoneHatchet,
    ["Simple", "Melee"],
    2,
    ["str"]
);
