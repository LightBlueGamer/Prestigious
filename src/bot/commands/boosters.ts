import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
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

        const embed = new EmbedBuilder()
            .setTitle(`${player.getName()}'s Boosters`)
            .setDescription(`${player.getName()} has ${player.boosts.xp.length+player.boosts.coins.length} active boosters.\n${player.boosts.xp.map(x => `${x.amount}X XP expires <t:${Math.floor(x.duration/1000)}:R>`).join('\n')}\n${player.boosts.coins.map(x => `${x.amount}X Coins expires <t:${Math.floor(x.duration/1000)}:R>`).join('\n')}`)
            .setColor('Random')
        return interaction.editReply({
            embeds: [embed],
            allowedMentions: {
                repliedUser: player.ping,
            }
        });

    },
};
