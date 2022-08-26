import { Lootbox } from "../lib/structures/Lootbox";
import { common, rare } from "./rarities";

export const lootboxBox = new Lootbox('Lootbox', 'A standard lootbox containing a random reward', common, 1250, 5000, 'Lootbox');
export const creatureBox = new Lootbox('Creature Crate', 'A crate containing a random creature', rare, 1000, 8000, 'Creature');
export const boosterBox = new Lootbox('Booster Crate', 'A crate containing a random booster', rare, 850, 10000, 'Booster');