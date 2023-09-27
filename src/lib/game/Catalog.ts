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
        150000,
        0
    ),
    Stick: new Item(
        Rarities.VeryCommon,
        "Stick",
        "A dead branch from a bush.",
        1,
        135000,
        0
    ),
    PlantFiber: new Item(
        Rarities.Common,
        "Plant Fiber",
        "Fiber gathered from different plants.",
        1,
        105000,
        0
    ),
    Meteor: new Item(
        Rarities.Rare,
        "Meteor",
        "Meteor that came from space.",
        1,
        22500,
        0
    )
};
