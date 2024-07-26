import { Client, ActivityType } from "discord.js";
import { version } from "../../../package.json";

export default {
    name: "ready",
    once: true,
    async execute(client: Client) {
        if (!client.user) return console.error(`No client user was found.`);
        client.user.setPresence({
            status: "online",
            activities: [
                {
                    name: `Prestigious V${version}`,
                    type: ActivityType.Custom,
                    state: `Adventuring in ${client.guilds.cache.size} servers with ${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)} players!`,
                },
            ],
        });
        console.log(`Bot is running as ${client.user.username}.`);
    },
};
