import type { Message } from "discord.js";
import { Player } from "../lib/classes/Player.js";
import { countRepeats, random, valuateArr } from "../utils/functions.js";

const cooldown = new Set();

export default {
    name: 'messageCreate',
    once: false,
    async execute(message: Message) {
        const { member, client } = message;
        if(!member || member.user.bot) return;
        if(!cooldown.has(member.id)) {
            const toGive = valuateArr(countRepeats(message.content.split('')));
            const player = await Player.get(member.id, client);
            player
                .addExperience(random(toGive*0.70, toGive*1.2))
                .addMoney(random(toGive*0.9, toGive*1.35))
                .save();

            if(player.experience >= player.experienceRequirement()) {
                player
                    .increaseLevel()
                    .save();
                message.channel.send({
                    content: `Congratulations ${member.displayName} you have leveled up to level ${player.level}!`
                });
            };

            cooldown.add(member.id);
            setTimeout(() => {
                cooldown.delete(member.id);
            }, 10000);
        }
    },
};