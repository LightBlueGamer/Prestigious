import { ChannelType, Message } from "discord.js";
import { Clan } from "../../lib/structures/Clan";
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
        // Player functions

        // Get clan boosters
        const clanXp = (await Clan.getFromUser(user.id)) ? (await Clan.getFromUser(user.id))!.stats.xpMultiplier : 1;
        const clanCoin = (await Clan.getFromUser(user.id)) ? (await Clan.getFromUser(user.id))!.stats.coinMultiplier : 1;

        if(!cooldown.has(user.id)) {
            const xp = player.addXp(clanXp);
            player.addCoins(clanCoin);
            const messaging = player.messagingReward();

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
    }
};