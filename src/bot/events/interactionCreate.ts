import type { Interaction } from "discord.js";

export default {
    name: 'interactionCreate',
    once: false,
    async execute(interaction: Interaction) {
        
        if(interaction.isChatInputCommand()) return interaction.client.emit('chatInputCommandInteraction', interaction);
        if(interaction.isContextMenuCommand()) return interaction.client.emit('contextMenuCommandInteraction', interaction);
        else return;
    }
}