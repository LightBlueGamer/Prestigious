import { Lootbox } from "../../lib/game/Lootbox.js";
import * as cItems from "../items.js";

const items = Object.values(cItems).filter((item) => item.inLootbox);

export const CommonLootbox = new Lootbox(
    "Lootbox",
    Lootbox.Type.Standard,
    Lootbox.Rarity.Common,
    items
);
