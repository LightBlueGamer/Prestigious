import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../lib/classes/Player.js';
export default {
    data: new SlashCommandBuilder()
        .setName("withdraw")
        .setDescription("Withdraw money from your bank")
        .addNumberOption((option) => option.setName('amount').setDescription('The amount to withdraw').setRequired(true))
        .setDMPermission(false),
    async execute (interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { user, client } = interaction;
        const amount = interaction.options.getNumber('amount', true);
        const player = await Player.get(user.id, client);
        let message: string;
        if(amount >= player.balance) message = `You have withdrawn all your money from your bank account. You now have $${player.balance+player.bank} in your wallet.`;
        if(amount <= 0) message = `You withdrew imaginary money from your bank account. You still have $${player.balance} in your wallet.`;
        else message = `You withdrew $${amount} from your bank account. You now have $${player.bank+amount} in your wallet.`;
        player
            .withdrawMoney(amount)
            .save();
        interaction.editReply({
            content: message
        });
    },
};