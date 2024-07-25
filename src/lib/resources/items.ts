import { Item } from "../classes/Item.js";
import { LootboxItem } from "../classes/LootboxItem.js";

export const items = {
    Pebble: new Item("Pebble", 1, 1, 10000000),
    Twig: new Item("Twig", 1, 2, 9500000),
    Fibers: new Item("Fibers", 1, 3, 9500000),
    Bark: new Item("Bark", 1, 4, 9250000),
    Rock: new Item("Rock", 1, 5, 9250000),
    Feather: new Item("Feather", 1, 6, 9200000),
    Fur: new Item("Fur", 1, 7, 9200000),
    Scales: new Item("Scales", 1, 8, 9175000),
    Leather: new Item("Leather", 1, 9, 9175000),
    Potatoes: new Item("Potatoes", 1, 10, 9170000),
    Carrot: new Item("Carrot", 1, 11, 9170000),

    MinorGemstone: new Item("Minor Gemstone", 1, 1250, 22000, false),

    CommonLootboxItem: new LootboxItem(
        "Common Lootbox",
        1,
        5000,
        50000,
        true,
        false,
        true,
        false
    ),
};
