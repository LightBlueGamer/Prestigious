import type { Message } from "discord.js";
import { Player } from "../lib/classes/Player";

const globalCD = new Set();

export default {
    name: 'messageCreate',
    once: false,
    async execute(message: Message) {
        const { client, author } = message;
        if (!message.inGuild() || author.bot) return;

        // Global system
        if (!globalCD.has(author.id)) {
            const player = await Player.get(author.id, client);

            player
                .giveRandomBalance(10, 25)
                .giveRandomExp(25, 50)
                .updateName(author.username);

            if (player.experience >= player.expRequirement()) player.levelUp();

            await player.save();

            globalCD.add(author.id);
            setTimeout(() => {
                globalCD.delete(author.id);
            }, 1000 * 10);
        };
    },
};