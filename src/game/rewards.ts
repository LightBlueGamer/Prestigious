import { Reward } from "../lib/structures/Reward";
import { lootboxBox, creatureBox, boosterBox } from "./lootboxes";
import * as creatures from "./creatures";
import * as boosters from "./boosters";
import * as containers from "./containers";

export const lootboxReward = new Reward(lootboxBox.name, lootboxBox.description, lootboxBox.rarity, lootboxBox.weight, 'Lootbox');
export const creatureCrateReward = new Reward(creatureBox.name, creatureBox.description, creatureBox.rarity, creatureBox.weight, 'Lootbox');
export const creatureRewards = creatures.default.map(creature => new Reward(creature.name, creature.description, creature.rarity, creature.weight, 'Creature'));
export const boosterCrateReward = new Reward(boosterBox.name, boosterBox.description, boosterBox.rarity, boosterBox.weight, 'Lootbox');
export const boosterRewards = Object.values(boosters).map(booster => new Reward(booster.name, `A ${booster.name}`, booster.rarity, booster.weight, 'Booster'));
export const containerRewards = Object.values(containers).map(container => new Reward(container.name, `A ${container.name.toLowerCase()}`, container.rarity, container.weight, 'Container'));