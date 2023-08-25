import type { Client } from "discord.js";
import { log } from "../utils/logger.js";

export default {
    name: "ready",
    once: true,
    async execute(client: Client) {
        if (!client.user) return console.error(`No client user was found.`);
        log(`Bot is running as ${client.user.username}.`);
    },
};
