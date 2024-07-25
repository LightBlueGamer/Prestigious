import type { Message } from "discord.js";
import { Player } from "../../lib/library.js";

const cooldown = new Set();

export default {
    name: "messageCreate",
    once: false,
    async execute(message: Message) {
        const { member, client } = message;

        if (!member || member.user.bot) return;
        if (!cooldown.has(member.id)) {
            const player = await Player.get(member.id, client);

            player
                .increaseXP(10, 75)
                .increaseBalance(15, 50)
                .addStatistic("Messages sent");

            if (player.data.xp >= player.xpRequired()) {
                player.levelUp();
                let content;
                if (player.data.level >= 20)
                    content = `Congratulations, ${player.name}! You've reached level ${player.data.level} and can now prestige to P${player.data.prestige + 1} using the /prestige command!`;
                else
                    (content = `Congratulations, ${player.name}! You've reached level ${player.data.level}!`),
                        message.channel.send({
                            content,
                        });
            }

            player.save();

            cooldown.add(member.id);
            setTimeout(() => {
                cooldown.delete(member.id);
            }, 1000 * 30);
        }
    },
};
