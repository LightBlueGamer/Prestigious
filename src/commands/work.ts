import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../lib/classes/Player';
export default {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Work for some hard earned cash")
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client } = interaction;
        const player = await Player.get(user.id, client);
        const curBalance = player.balance;

        await interaction.deferReply();

        player
            .giveRandomBalance((player.level * 0.5 + 0.5) * 300, (player.level * 0.5 + 0.5) * 600)
            .save();

        await interaction.editReply({
            content: `You worked hard and earned $${player.balance - curBalance}`
        });
    },
};