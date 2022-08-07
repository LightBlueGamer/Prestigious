import { Loottable } from "../lib/structures/Loottable";
import { creatureRewards, lootboxReward, creatureCrateReward } from "./rewards";

export const messaging = new Loottable('Messaging', [
    lootboxReward
]);

export const daily = new Loottable('Daily', [
    lootboxReward
]);

export const lootboxTable = new Loottable('Lootbox', [
    creatureCrateReward
]);

export const creatureTable = new Loottable('Creature', creatureRewards);