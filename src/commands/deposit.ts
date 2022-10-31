import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { GreenEmbed } from '../lib/classes/ColorEmbeds';
import { Player } from '../lib/classes/Player';
export default {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit money to your bank.")
        .addNumberOption((o) => o.setName("amount").setDescription("Amount to deposit").setMinValue(1).setAutocomplete(true).setRequired(true))
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const amount = Math.floor(interaction.options.getNumber("amount", true));
        const { user, client } = interaction;
        let content = "";

        await interaction.deferReply();

        const player = await Player.get(user.id, client);

        if (amount > player.balance) content = `You deposited $${player.balance} to your bank.`, deposit(player, player.balance);
        else deposit(player, amount), content = `You deposited $${amount} to your bank.`;

        const embed = new GreenEmbed()
            .setTitle(content)

        return interaction.editReply({
            embeds: [embed]
        });
    },
};

function deposit(player: Player, amount: number) {
    player.deposit(amount).save();
}