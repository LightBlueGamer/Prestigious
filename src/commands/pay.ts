import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../lib/classes/Player';
export default {
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Pay another player")
        .addUserOption((option) => option.setName("player").setDescription("The player to pay").setRequired(true))
        .addNumberOption((option) => option.setName("amount").setDescription("The amount to pay").setMinValue(1).setRequired(true))
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const toPay = interaction.options.getUser("player", true);

        if (toPay.bot) return interaction.reply({
            content: `You can't pay money to a bot.`
        });

        const amount = Math.floor(interaction.options.getNumber("amount", true));
        const { user, client } = interaction;
        const player = await Player.get(user.id, client);
        const paidPlayer = await Player.get(toPay.id, client);
        let content = "";

        await interaction.deferReply();

        if (player.balance < amount) content = `You paid ${paidPlayer.name} $${player.balance}`, player.pay(paidPlayer, player.balance).save();
        else content = `You paid ${paidPlayer.name} $${amount}`, player.pay(paidPlayer, amount).save();

        return interaction.editReply({
            content
        });
    },
};