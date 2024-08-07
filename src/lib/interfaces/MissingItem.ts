import type { Item } from "../classes/Item.js";

export interface MissingItem {
    item: Item;
    amountMissing: number;
}
