import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
export default {
    data: new SlashCommandBuilder()
        .setName("deposit")
        .setDescription("Deposit money to your bank.")
        .addNumberOption((o) => o.setName("Amount").setMinValue(1))
        .setDMPermission(false),
    async execute (interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
    },
};