import type { ContextMenuCommandInteraction } from "discord.js";
import { commands } from "../../index.js";

export default {
    name: "contextMenuCommandInteraction",
    once: false,
    async execute(interaction: ContextMenuCommandInteraction) {
        const { user } = interaction;
        if (user.bot) return;

        const command = commands.get(interaction.commandName);
        if (!command) return;
        if (!interaction.inGuild()) {
            return interaction.reply({
                content: `Commands can only be used inside servers!`,
                ephemeral: false,
            });
        }

        try {
            command.execute(interaction);
        } catch (error) {
            return console.error(error);
        } finally {
            const string = `Command ${interaction.commandName} was used by ${interaction.user.tag} at ${new Date().toDateString()} ${new Date().toTimeString()}\n`;
            console.log(string);
        }
    },
};
