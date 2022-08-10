import type { Reward } from "./Reward";

export class Loottable {
    name: string;
    rewards: Loottable.Rewards;
    constructor(name: string, rewards: Loottable.Rewards) {
        this.name = name;
        this.rewards = rewards;
    }

    generateReward() {
        let totalWeight = this.rewards.reduce((acc, reward) => acc + reward.weight, 0);
        let random = Math.random() * totalWeight;
        let currentWeight = 0;
        for (let reward of this.rewards) {
            currentWeight += reward.weight;
            if (random < currentWeight) {
                return reward;
            }
        }

        return this.rewards[0];
    }
}

export namespace Loottable {
    export type Rewards = Reward[];
}