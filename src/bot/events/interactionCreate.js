import { Player } from "../../lib/structures/Player";

export default {
    name: 'interactionCreate',
    once: false,
    async execute(interaction) {

        const { user } = interaction;
        if(user.bot) return;

        const player = await Player.get(user.id);
        player.save();
        
        if(interaction.isChatInputCommand()) return interaction.client.emit('chatInputCommandInteraction', interaction);
        if(interaction.isContextMenuCommand()) return interaction.client.emit('contextMenuCommandInteraction', interaction);
        if(interaction.isAutocomplete()) return interaction.client.emit('autoCompleteInteraction', interaction);
        else return;
    }
}