import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Clan } from '../../lib/structures/Clan';
import { Player } from '../../lib/structures/Player';

export default {
    data: new SlashCommandBuilder()
        .setName('boosters')
        .setDescription('Checks the status of your or someone elses boosters.')
        .addUserOption((option) => option.setName('user').setDescription('The user to check the boosters of.'))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const user = interaction.options.getUser('user') || interaction.user;
        const player = await Player.get(user.id);
        const clan = await Clan.getFromUser(user.id);
        const xpBoost = clan?.stats.xpMultiplier || 0;
        const coinBoost = clan?.stats.coinMultiplier || 0;

        const embed = new EmbedBuilder()
            .setTitle(`${player.getName()}'s Boosters`)
            .setDescription(`${xpBoost > 1 ? `\nClan XP Boost: ${xpBoost.toFixed(1)}X` : ''}${coinBoost > 1 ? `\nClan Coin Boost: ${coinBoost.toFixed(1)}X` : ''}${player.boosts.xp.length > 0 ? '\n' : ''}${player.boosts.xp.map(x => `${x.amount}X XP expires <t:${Math.floor(x.duration/1000)}:R>`).join('\n')}\n${player.boosts.coins.length > 0 ? '\n' : ''}${player.boosts.coins.map(x => `${x.amount}X Coins expires <t:${Math.floor(x.duration/1000)}:R>`).join('\n')}`)
            .setColor('Random')
        return interaction.editReply({
            embeds: [embed],
            allowedMentions: {
                repliedUser: player.ping,
            }
        });

    },
};
