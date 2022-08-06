import { Loottable } from "../lib/structures/Loottable";
import { creatureBox } from "./lootboxes";
import { creatureRewards, lootboxReward } from "./rewards";

export const messaging = new Loottable('Messaging', [
    lootboxReward
]);

export const daily = new Loottable('Daily', [
    lootboxReward
]);

export const lootboxTable = new Loottable('Lootbox', [
    creatureBox
]);

export const creatureTable = new Loottable('Creature', creatureRewards);