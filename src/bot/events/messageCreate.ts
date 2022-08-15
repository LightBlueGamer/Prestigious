import { ChannelType, Message } from "discord.js";
import { Player } from "../../lib/structures/Player";
const cooldown = new Set();

export default {
    name: 'messageCreate',
    once: false,
    async execute(message: Message) {
        const user = message.author;
        if(user.bot) return;
        if(message.channel.type === ChannelType.DM) return;

        // Ensure the player in the database and fetch it.
        const player = await Player.get(user.id);

        player.checkBoosters();

        if(!cooldown.has(user.id)) {
            const xp = await player.addXp();
            await player.addCoins();
            const messaging = player.messagingReward();
            player.messages++;

            //Messages
            if(xp) message.reply({
                content: xp,
                allowedMentions: {
                    repliedUser: player.ping,
                },
            });
            if(messaging) message.reply({
                content: messaging,
                allowedMentions: {
                    repliedUser: player.ping,
                },
            });

            //Save
            player.save();

            cooldown.add(user.id);
            setTimeout(() => cooldown.delete(user.id), 1000 * 10);
        }
        return;
    }
};