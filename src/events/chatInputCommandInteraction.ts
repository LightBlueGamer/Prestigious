/** @format */

import { commands } from "../index.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { log } from "../utils/logger.js";

export default {
    name: "chatInputCommandInteraction",
    once: false,
    async execute(interaction: ChatInputCommandInteraction) {
        const { user } = interaction;
        if (user.bot) return;

        const command = commands.get(interaction.commandName);
        if (!command) return;

        try {
            command.execute(interaction);
        } catch (error) {
            return console.error(error);
        } finally {
            const string = `Command ${interaction.commandName} was used by ${interaction.user.tag}`;
            log(string);
        }
    },
};
