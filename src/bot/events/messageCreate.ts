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
                .increaseXp(10, 75)
                .increaseBalance(15, 50)
                .addStatistic("Messages sent");

            if (player.data.xp >= player.requiredXp) {
                player.levelUp();
                let content;
                if (player.data.level >= 20)
                    content = `Congratulations, ${player.name}! You've reached level ${player.level} and have gained 1 attribute point, you can see your attributes with the /attributes command or you can prestige to P${player.prestige + 1} using the /prestige command!`;
                else
                    (content = `Congratulations, ${player.name}! You've reached level ${player.level} and have gained 1 attribute point, you can see your attributes with the /attributes command!`),
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
