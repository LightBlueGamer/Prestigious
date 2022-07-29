import type { ContextMenuCommandInteraction } from "discord.js";
import { commands } from "..";
import type { Command } from "../../lib/structures/Command";
import { appendFileSync } from "fs";
import { resolve } from "path";

export default {
    name: 'contextMenuCommandInteraction',
    once: false,
    async execute(interaction: ContextMenuCommandInteraction) {
        const { user } = interaction;
        if (user.bot) return;
        
        let command: Command;
        if(commands.has(interaction.commandName)) command = commands.get(interaction.commandName)!;
        else return;
        if(!interaction.inGuild()) {
            return interaction.reply({
                content: `Commands can only be used inside servers!`,
                ephemeral: true,
            });
        }

        try {
            command.execute(interaction);
        } catch (error) {
            return console.error(error);
        } finally {
            const string = `Command ${interaction.commandName} was used by ${interaction.user.tag} at ${new Date().toDateString()} ${new Date().toTimeString()}`;
            appendFileSync(resolve('logs.txt'), string);
            console.log(string);
        }

    }
}