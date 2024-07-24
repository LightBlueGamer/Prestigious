import { Client, ActivityType } from "discord.js";

export default {
    name: "ready",
    once: true,
    async execute(client: Client) {
        if (!client.user) return console.error(`No client user was found.`);
        console.log(`Bot is running as ${client.user.username}.`);
        client.user.setStatus("dnd");
        client.user.setActivity({
            name: "Development",
            type: ActivityType.Watching,
        });
    },
};
