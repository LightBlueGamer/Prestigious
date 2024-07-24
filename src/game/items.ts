import { Item } from "../lib/game/Item.js";
import { LootboxItem } from "../lib/game/LootboxItem.js";

export const Pebble = new Item("Pebble", 1, 1, 10000000);
export const Twig = new Item("Twig", 1, 2, 9500000);
export const Fibers = new Item("Fibers", 1, 3, 9500000);
export const Bark = new Item("Bark", 1, 4, 9250000);
export const Rock = new Item("Rock", 1, 5, 9250000);
export const Feather = new Item("Feather", 1, 6, 9200000);
export const Fur = new Item("Fur", 1, 7, 9200000);
export const Scales = new Item("Scales", 1, 8, 9175000);
export const Leather = new Item("Leather", 1, 9, 9175000);
export const Potatoes = new Item("Potatoes", 1, 10, 9170000);
export const Carrot = new Item("Carrot", 1, 11, 9170000);

export const MinorGemstone = new Item("Minor Gemstone", 1, 1250, 22000, false);

export const CommonLootbox = new LootboxItem(
    "Common Lootbox",
    1,
    5000,
    50000,
    true,
    false,
    true,
    false
);
