import { Reward } from "../lib/structures/Reward";
import { lootboxBox } from "./lootboxes";
import * as creatures from "./creatures";

export const lootboxReward = new Reward(lootboxBox.name, lootboxBox.description, lootboxBox.rarity, lootboxBox.weight, 'Lootbox');
export const creatureRewards = Object.values(creatures).map(creature => new Reward(creature.name, creature.description, creature.rarity, creature.weight, 'Creature'));