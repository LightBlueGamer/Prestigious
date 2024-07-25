import { Class } from "../classes/Class.js";

export const classes = {
    Warrior: new Class(
        "Warrior",
        ["str", "def"],
        ["Swords", "Shields", "Two-Handed", "Heavy-Armor"]
    ),
    Mage: new Class("Mage", ["int", "wis"], ["Wands", "Staffs"]),
};
