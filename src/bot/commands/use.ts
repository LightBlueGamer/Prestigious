import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Player } from "../../lib/structures/Player";

export default {
    data: new SlashCommandBuilder()
        .setName('use')
        .setDescription('Use a item in your inventory.')
        .addStringOption((option) => option.setName('item').setDescription('The item to use.').setRequired(true).setAutocomplete(true))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const player = await Player.get(interaction.user.id);
        await interaction.deferReply();
        const item = interaction.options.getString('item', true);
        const invItem = player.getItem(item);
        if(!invItem) {return interaction.editReply({
            content: `You don't have any ${item} in your inventory!`,
            allowedMentions: {
                repliedUser: player.ping,
            },
        });}
        
        player.useItem(invItem);
        player.save();
        return interaction.editReply({
            content: `You used your a ${item}!`,
            allowedMentions: {
                repliedUser: player.ping,
            },
        });
    }
}