import { Player } from "../lib/game/Player.js";
import type { Message } from "discord.js";
import { random } from "../utils/misc.js";

const cooldown = new Set();

export default {
    name: "messageCreate",
    once: false,
    async execute(message: Message) {
        const { member, client } = message;
        if (!member || member.user.bot) return;
        if (!cooldown.has(member.id)) {
            const player = await Player.get(member.id, client);

            player.addBalWallet(random(10, 35)).addExp(random(2, 5)).save();

            cooldown.add(member.id);
            setTimeout(() => {
                cooldown.delete(member.id);
            }, 30000);
        }
    },
};
