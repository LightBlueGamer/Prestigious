import { commands } from "../../index.js";
import type { ChatInputCommandInteraction } from "discord.js";
import { Player } from "../../lib/game/Player.js";

export default {
    name: "chatInputCommandInteraction",
    once: false,
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client } = interaction;

        const player = await Player.get(user.id, client);

        if (user.bot) return;

        const command = commands.get(interaction.commandName);
        if (!command) return;

        try {
            command.execute(interaction);
            player.addStatistic("Commands used").save();
        } catch (error) {
            return console.error(error);
        } finally {
            const string = `Command ${interaction.commandName} was used by ${interaction.user.tag} at ${new Date().toDateString()}`;
            console.log(string);
        }
    },
};
