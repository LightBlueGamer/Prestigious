import { Backpack } from "./Backpack.js";
import { Item } from "./Item.js";
import { Rarities } from "./Rarities.js";

export const Backpacks = {
    Pouch: new Backpack(
        Rarities.VeryCommon,
        "Pouch",
        "Just a pouch you grabbed from home.",
        0,
        0,
        1,
        10,
        []
    ),
};

export const Items = {
    Stone: new Item(
        Rarities.VeryCommon,
        "Stone",
        "A stone scavenged from the ground.",
        1,
        150000
    ),
    Stick: new Item(
        Rarities.VeryCommon,
        "Stick",
        "A dead branch from a bush.",
        1,
        135000
    ),
    PlantFiber: new Item(
        Rarities.Common,
        "Plant Fiber",
        "Fiber gathered from different plants.",
        1,
        105000
    )
};
