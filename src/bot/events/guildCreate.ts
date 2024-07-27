import { ActivityType, Guild } from "discord.js";
import { getPackageJSONData } from "../../lib/library.js";

export default {
    name: "guildCreate",
    once: false,
    async execute(guild: Guild) {
        const { client } = guild;
        if (!client.user) return console.error(`No client user was found.`);
        const { version } = getPackageJSONData();

        setTimeout(() => {
            client.user?.setPresence({
                status: "online",
                activities: [
                    {
                        name: `CustomStatus`,
                        type: ActivityType.Custom,
                        state: `Prestigious V${version} - Adventuring in ${client.guilds.cache.size} servers with ${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)} players!`,
                    },
                ],
            });
        }, 5000);
        console.log(`Bot is running as ${client.user.username}.`);
    },
};
