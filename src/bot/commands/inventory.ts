import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Player } from "../../lib/structures/Player";

export default {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Show your inventory.')
        .addUserOption(option => option.setName('user').setDescription('The user to check the inventory of.'))
        .addNumberOption(option => option.setName('page').setDescription('The page to show.'))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const page = interaction.options.getNumber('page') || 1;
        const user = interaction.options.getUser('user') || interaction.user;
        const player = await Player.get(user.id);
        const inventorySize = player.inventory.length;
        const inventory = inventorySize > 0 ? player.getInventory(page).map(item => `${item.amount}x ${item.name}`).join('\n') : `You don't have any items`;
        const embed = new EmbedBuilder()
            .setTitle(`${user.tag}'s Inventory`)
            .setDescription(inventory);

        return interaction.editReply({embeds: [embed], allowedMentions: {
            repliedUser: player.ping
        }});
    }
}