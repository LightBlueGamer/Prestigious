import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { globalEcon } from '../database';
export default {
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Checks the stats for Prestigious")
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const banked = Math.floor((await globalEcon.map(({ bank }) => bank)).reduce((p, c) => p + c, 0));
        const pocketed = Math.floor((await globalEcon.map(({ balance }) => balance)).reduce((p, c) => p + c, 0));
        const averageNet = Math.floor((banked + pocketed) / await globalEcon.size);
        const richest = (await globalEcon.map(({ bank, balance, name }) => ({ name, value: bank + balance }))).sort((a, b) => b.value - a.value)[0];

        await interaction.deferReply();

        const embed = new EmbedBuilder()
            .setTitle(`Global Stats`)
            .setColor("Random")
            .setDescription(`Average net worth: $${averageNet}
            Richest player: ${richest.name} - $${richest.value}, ${(richest.value / (banked + pocketed) * 100).toFixed(0)}% of total money`)
            .addFields([
                { name: `Banked money`, value: `$${banked}`, inline: true },
                { name: `Pocketed money`, value: `$${pocketed}`, inline: true },
                { name: `Total money`, value: `$${pocketed + banked}`, inline: true },
            ]);

        return interaction.editReply({
            embeds: [embed]
        });
    },
};