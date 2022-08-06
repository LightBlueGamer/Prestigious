import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { Player } from "../../lib/structures/Player";
import * as lootboxes from "../../game/lootboxes";
import * as rewards from "../../game/rewards";

export default {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Buy lootboxes from the shop.')
        .addStringOption((option) => option.setName('item').setDescription('Lootbox to buy.').setRequired(true).setAutocomplete(true))
        .addNumberOption((option) => option.setName('amount').setDescription('Amount of items to buy.').setRequired(false))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction) {
        const amount = interaction.options.getNumber('amount') || 1;
        const item = interaction.options.getString('item');
        const lootbox = Object.values(lootboxes).find(lootbox => lootbox.name.toLowerCase() === item?.toLowerCase());
        const { user } = interaction;
        const player = await Player.get(user.id);
        if(player.coins < amount * lootbox?.price) {
            interaction.editReply('You do not have enough coins to buy that.');
            return;
        }

        const reward = Object.values(rewards).find(reward => reward.name.toLowerCase() === lootbox?.name?.toLowerCase());

        player.coins -= amount * lootbox?.price;
        player.addItem(reward, amount);
        const itm = player.getItem(reward.name);
        player.removeItem(itm, amount);
        player.save();

        interaction.editReply(`You bought ${amount} ${lootbox?.name}${amount > 1 ? 's' : ''} for ${amount * lootbox?.price} coins.`);
    }
}