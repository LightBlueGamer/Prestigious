import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../../lib/structures/Player';

export default {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Pay another player.')
        .setDMPermission(false)
        .addUserOption(option => option.setName('user').setDescription('The user to pay.').setRequired(true))
        .addIntegerOption(option => option.setName('amount').setDescription('The amount to pay.').setRequired(true))
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { user } = interaction;
        const player = await Player.get(user.id);
        const target = interaction.options.getUser('user');
        if(!target) return;
        if(target.bot) return interaction.editReply({content: 'You cannot pay a bot.', allowedMentions: {repliedUser: player.ping}});
        const targetPlayer = await Player.get(target.id);
        const amount = Math.floor(interaction.options.getInteger('amount', true));
        if(user.id === target.id) return interaction.editReply({content: 'You cannot pay yourself.'});

        player.removeCoins(amount);
        targetPlayer.addSetCoins(amount);
        player.save();
        targetPlayer.save();
        return interaction.editReply({
            content: `You paid ${targetPlayer.getName()} ${amount} coins.`,
            allowedMentions: {
                repliedUser: player.ping,
            }
        });
    },
}