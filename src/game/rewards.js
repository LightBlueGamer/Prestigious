import { Reward } from "../lib/structures/Reward";
import { lootboxBox, creatureBox } from "./lootboxes";
import * as creatures from "./creatures";

export const lootboxReward = new Reward(lootboxBox.name, lootboxBox.description, lootboxBox.rarity, lootboxBox.weight, 'Lootbox');
export const creatureCrateReward = new Reward(creatureBox.name, creatureBox.description, creatureBox.rarity, creatureBox.weight, 'Lootbox');
export const creatureRewards = creatures.default.map(creature => new Reward(creature.name, creature.description, creature.rarity, creature.weight, 'Creature'));