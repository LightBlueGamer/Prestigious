import { Lootbox } from "../classes/Lootbox.js";
import { items } from "./items.js";

const filteredItems = Object.values(items).filter((item) => item.inLootbox);

export const lootboxes = {
    CommonLootbox: new Lootbox(
        "Lootbox",
        Lootbox.Type.Standard,
        Lootbox.Rarity.Common,
        filteredItems
    ),
};
