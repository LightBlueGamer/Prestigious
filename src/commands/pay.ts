import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../lib/classes/Player.js';
export default {
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Pay someone else")
        .addUserOption((option) => option.setName('user').setDescription('The user to pay').setRequired(true))
        .addNumberOption((option) => option.setName('amount').setDescription('The amount to pay the user').setRequired(true))
        .setDMPermission(false),
    async execute (interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { user, client } = interaction; 
        const userToPay = interaction.options.getUser('user', true);
        const amount = interaction.options.getNumber('amount', true);
        const player = await Player.get(user.id, client);
        const playerToPay = await Player.get(userToPay.id, client);
        if(amount > player.balance) return interaction.editReply({
            content: `You don't have $${amount} in your wallet to pay.`
        });
        if(amount <= 0) return interaction.editReply({
            content: `You can't pay someone $0`
        });
        if(userToPay.bot) return interaction.editReply({
            content: `You can't pay a bot money.`
        });
        player
            .removeMoney(amount)
            .save();
        playerToPay
            .addMoney(amount)
            .save();
        try {
            userToPay.send({
                content: `You have been paid $${amount} by $${user.username}`
            });
        } catch (err) {
            console.error(err);
        };
        return interaction.editReply({
            content: `You paid $${amount} to ${userToPay.username}.`
        });
    },
};