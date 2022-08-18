import { Purse } from "../lib/structures/Purse";
import { Tome } from "../lib/structures/Tome";
import { epic, legendary, rare, uncommon } from "./rarities";

export const smallPurse = new Purse('Small Purse', 100, 500, uncommon, 300);
export const mediumPurse = new Purse('Medium Purse', 500, 1250, rare,  200);
export const largePurse = new Purse('Large Purse', 1250, 3000, epic, 150);
export const hugePurse = new Purse('Huge Purse', 3000, 7500, legendary, 50);

export const smallTome = new Tome('Small Tome', 50, 250, uncommon, 300);
export const mediumTome = new Tome('Medium Tome', 250, 750, rare, 200);
export const largeTome = new Tome('Large Tome', 750, 2000, epic, 150);
export const hugeTome = new Tome('Huge Tome', 2000, 4000, legendary, 50);
