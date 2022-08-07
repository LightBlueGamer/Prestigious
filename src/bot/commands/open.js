import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import * as lootboxes from "../../game/lootboxes";
import { Player } from "../../lib/structures/Player";
export default {
    data: new SlashCommandBuilder()
        .setName('open')
        .setDescription('Open a lootbox')
        .addStringOption(option => option.setName('lootbox').setDescription('The lootbox to open.').setAutocomplete(true).setRequired(true))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction) {
        await interaction.deferReply();
        const { user } = interaction;
        const player = await Player.get(user.id);
        const box = interaction.options.getString('lootbox');
        const lootbox = Object.values(lootboxes).find(lootbox => lootbox.name.toLowerCase() === box?.toLowerCase());
        const reward = lootbox?.open();
        player.addItem(reward, 1);
        player.removeItem(lootbox, 1);
        player.save();
        interaction.editReply(`You opened a ${lootbox?.name} and got a ${reward.name}!`);
    }
}