import { Class } from "../lib/game/Class";

export const Warrior = new Class(
    "Warrior",
    ["str", "def"],
    ["Swords", "Shields", "Two-Handed", "Heavy-Armor"]
);
export const Mage = new Class("Mage", ["int", "wis"], ["Wands", "Staffs"]);
