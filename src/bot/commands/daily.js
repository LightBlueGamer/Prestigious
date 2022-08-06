import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Player } from "../../lib/structures/Player";

export default {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Get your daily rewards.')
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction) {
        const user = interaction.user;
        const player = await Player.get(user.id);
        const daily = player.getDaily();
        player.save();
        return interaction.editReply({content: daily, allowedMentions: {
            repliedUser: player.ping
        }});
    }
}