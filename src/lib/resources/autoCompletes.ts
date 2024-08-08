import { CraftableItem } from "../classes/CraftableItem.js";
import { LootboxItem } from "../classes/LootboxItem.js";
import { itemIsEquipment } from "../utils/functions.js";
import { items } from "./items.js";

export const lootboxes: Choice[] = Object.values(items)
    .filter((i) => i instanceof LootboxItem)
    .map((box) => ({
        name: `${box.name}`,
        value: box.name,
    }));

export const buy: Choice[] = Object.values(items)
    .filter((item) => item.buy)
    .map((item) => ({
        name: ` ${item.name} for $${Math.ceil(item.value * 1.3)}/item`,
        value: `${item.name}`,
    }));

export const item = Object.values(items).map((itm) => ({
    name: `${itm.name}`,
    value: `${itm.name}`,
}));

export const recipes = Object.values(items)
    .filter((item) => item instanceof CraftableItem)
    .map((item) => ({ name: item.name, value: item.name }));

export const equip = Object.values(items)
    .filter((item) => itemIsEquipment(item))
    .map((item) => ({ name: item.name, value: item.name }));
