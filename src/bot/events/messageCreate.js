import { ChannelType } from "discord.js";
import { Player } from "../../lib/structures/Player";
const cooldown = new Set();

export default {
    name: 'messageCreate',
    once: false,
    async execute(message) {
        const user = message.author;
        if(user.bot) return;
        if(message.channel.type === ChannelType.DM) return;

        // Ensure the player in the database and fetch it.
        const player = await Player.get(user.id);
        // Player functions

        if(!cooldown.has(user.id)) {
            const xp = player.addXp();
            player.addCoins();
            const messaging = player.messagingReward();

            //Messages
            if(xp) message.reply(xp);
            if(messaging) message.reply(messaging);

            //Save
            player.save();

            cooldown.add(user.id);
            setTimeout(() => cooldown.delete(user.id), 1000 * 10);
        }
    }
};