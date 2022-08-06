import { Lootbox } from "../lib/structures/Lootbox";
import { common, rare } from "./rarities";

export const lootboxBox = new Lootbox('Lootbox', 'A standard lootbox containing a random reward', common, 1000, 5000, 'Lootbox');
export const creatureBox = new Lootbox('Creature Crate', 'A crate containing a random creature', rare, 250, 8000, 'Creature');