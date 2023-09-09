import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../lib/game/Player';
export default {
    devMode: true,
    data: new SlashCommandBuilder()
        .setName("scavenge")
        .setDescription("Scavenge for item based on your scavenging level")
        .setDMPermission(false),
    async execute (interaction: ChatInputCommandInteraction) {
        const { user, client } = interaction;
        const player = await Player.get(user.id, client);
        const { scavenge } = player.getStats();
        await interaction.deferReply();
    },
};