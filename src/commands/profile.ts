import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Player } from '../lib/classes/Player';

export default {
	data: new SlashCommandBuilder()
		.setName('profile')
		.setDescription('Checks a users profile.')
        .addUserOption((option) => option.setName('user').setDescription('The user to display the profile of.'))
		.setDMPermission(false),
	async execute(interaction: ChatInputCommandInteraction) {
        const { client } = interaction;
        const user = interaction.options.getUser('user') || interaction.user;
		await interaction.deferReply();

        const player = await Player.get(user.id, client);

        const embed = new EmbedBuilder()
            .setTitle(`${player.getName()} profile`)
            .setDescription(`Level ${player.level}\nExp ${player.experience}\nWallet $${player.balance}\nBank $${player.bank}`)
            .setColor("Random")
            .setFooter({ text: `Requested by ${interaction.user.username}`});

        await interaction.editReply({
            embeds: [ embed ]
        });
	},
};