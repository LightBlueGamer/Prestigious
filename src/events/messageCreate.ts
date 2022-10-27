import type { Message } from "discord.js";
import { econ, globalEcon } from "../database";
import { Player } from "../lib/classes/Player";

const globalCD = new Set();
const localCD = new Set();

export default {
	name: 'messageCreate',
	once: false,
	async execute(message: Message) {
        const { client, author, guildId, member } = message;
		if(!message.inGuild() || author.bot) return;

        // Global system
        if(!globalCD.has(author.id)) {
            const player = await Player.get(author.id, client);

            player
                .giveRandomBalance(10, 25)
                .giveRandomExp(25, 50)
                .updateName(author.username);

            if(player.experience >= player.expRequirement()) player.levelUp();

            await player.save(globalEcon);

            globalCD.add(author.id);
            setTimeout(() => {
                globalCD.delete(author.id);
            }, 1000 * 10);
        };

        // Local system
        if(!localCD.has(`${guildId}-${author.id}`)) {
            const player = await Player.getGuild(`${guildId}-${author.id}`, client);

            player
                .giveRandomBalance(10, 25)
                .giveRandomExp(25, 50)
                .updateName(member?.displayName!);

            if(player.experience >= player.expRequirement()) player.levelUp();

            await player.save(econ);

            localCD.add(`${guildId}-${author.id}`);
            setTimeout(() => {
                localCD.delete(`${guildId}-${author.id}`);
            }, 1000 * 10);
        };
	},
};