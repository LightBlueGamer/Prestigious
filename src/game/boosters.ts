import { Booster } from "../lib/structures/Booster";
import { common, epic, legendary, mythic, rare, uncommon } from "./rarities";

export const exp2X24H = new Booster('24H 2X EXP Booster', 'xp', (1000 * 60 * 60 * 24), 2, 300, mythic);
export const exp3X24H = new Booster('24H 3X EXP Booster', 'xp', (1000 * 60 * 60 * 24), 3, 100, mythic);
export const exp2X18H = new Booster('18H 2X EXP Booster', 'xp', (1000 * 60 * 60 * 18), 2, 900, legendary);
export const exp3X18H = new Booster('18H 3X EXP Booster', 'xp', (1000 * 60 * 60 * 18), 3, 300, legendary);
export const exp2X12H = new Booster('12H 2X EXP Booster', 'xp', (1000 * 60 * 60 * 12), 2, 1800, epic);
export const exp3X12H = new Booster('12H 3X EXP Booster', 'xp', (1000 * 60 * 60 * 12), 3, 600, epic);
export const exp2X6H = new Booster('6H 2X EXP Booster', 'xp', (1000 * 60 * 60 * 6), 2, 3600, rare);
export const exp3X6H = new Booster('6H 3X EXP Booster', 'xp', (1000 * 60 * 60 * 6), 3, 1200, rare);
export const exp2X3H = new Booster('3H 2X EXP Booster', 'xp', (1000 * 60 * 60 * 3), 2, 7200, uncommon);
export const exp3X3H = new Booster('3H 3X EXP Booster', 'xp', (1000 * 60 * 60 * 3), 3, 2400, uncommon);
export const exp2X1H = new Booster('1H 2X EXP Booster', 'xp', (1000 * 60 * 60 * 1), 2, 14400, common);
export const exp3X1H = new Booster('1H 3X EXP Booster', 'xp', (1000 * 60 * 60 * 1), 3, 4800, common);

export const coins2X24H = new Booster('24H 2X Coins Booster', 'coins', (1000 * 60 * 60 * 24), 2, 300, mythic);
export const coins3X24H = new Booster('24H 3X Coins Booster', 'coins', (1000 * 60 * 60 * 24), 3, 100, mythic);
export const coins2X18H = new Booster('18H 2X Coins Booster', 'coins', (1000 * 60 * 60 * 18), 2, 900, legendary);
export const coins3X18H = new Booster('18H 3X Coins Booster', 'coins', (1000 * 60 * 60 * 18), 3, 300, legendary);
export const coins2X12H = new Booster('12H 2X Coins Booster', 'coins', (1000 * 60 * 60 * 12), 2, 1800, epic);
export const coins3X12H = new Booster('12H 3X Coins Booster', 'coins', (1000 * 60 * 60 * 12), 3, 600, epic);
export const coins2X6H = new Booster('6H 2X Coins Booster', 'coins', (1000 * 60 * 60 * 6), 2, 3600, rare);
export const coins3X6H = new Booster('6H 3X Coins Booster', 'coins', (1000 * 60 * 60 * 6), 3, 1200, rare);
export const coins2X3H = new Booster('3H 2X Coins Booster', 'coins', (1000 * 60 * 60 * 3), 2, 7200, uncommon);
export const coins3X3H = new Booster('3H 3X Coins Booster', 'coins', (1000 * 60 * 60 * 3), 3, 2400, uncommon);
export const coins2X1H = new Booster('1H 2X Coins Booster', 'coins', (1000 * 60 * 60 * 1), 2, 14400, common);
export const coins3X1H = new Booster('1H 3X Coins Booster', 'coins', (1000 * 60 * 60 * 1), 3, 4800, common);