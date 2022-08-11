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
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { user } = interaction;
        const player = await Player.get(user.id);
        const box = interaction.options.getString('lootbox');
        const lootbox = Object.values(lootboxes).find(lootbox => lootbox.name.toLowerCase() === box?.toLowerCase());
        const reward = lootbox?.open();
        const invItem = player.getItem(lootbox?.name!);
        if(!invItem) return;
        if(!reward) return;
        if(!lootbox) return;
        player.addItem(reward, 1);
        player.removeItem(invItem, 1);
        player.save();
        interaction.editReply({
            content: `You opened a ${invItem.name} and got a ${reward.rarity.name} ${reward.name}!`,
            allowedMentions: {
                repliedUser: player.ping,
            }
        });
    }
}