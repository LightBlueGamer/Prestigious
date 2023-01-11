import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../lib/classes/Player.js';
export default {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit money into your bank")
        .addNumberOption((option) => option.setName('amount').setDescription('The amount to deposit').setRequired(true))
        .setDMPermission(false),
    async execute (interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { user, client } = interaction;
        const amount = interaction.options.getNumber('amount', true);
        const player = await Player.get(user.id, client);
        let message: string;
        if(amount >= player.balance) message = `You have deposited all your money to your bank account. You now have $${player.balance+player.bank} deposited.`;
        if(amount <= 0) message = `You deposited imaginary money to your bank account. You still have $${player.balance} deposited.`;
        else message = `You deposited $${amount} to your bank account. You now have $${player.bank+amount} deposited.`;
        player
            .depositMoney(amount)
            .save();
        interaction.editReply({
            content: message
        });
    },
};