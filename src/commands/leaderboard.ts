import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { globalEcon } from '../database';
import { Player } from '../lib/classes/Player';
export default {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows the global leaderboard")
        .addNumberOption((option) => option.setName("page").setDescription("The page to show").setMinValue(1).setRequired(false))
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client } = interaction;
        const player = await Player.get(user.id, client);
        let page = interaction.options.getNumber('page') || 1;
        if (page > await globalEcon.size) page = Math.ceil(await globalEcon.size / 10);
        const players = (await globalEcon.values)
            .sort((a, b) => b.level - a.level || b.experience - a.experience || (b.balance + b.bank) - (a.balance + a.bank));

        await interaction.deferReply();

        await interaction.editReply({
            embeds: [await getEmbed(players, page, player)],
        });
    },
};

async function getEmbed(players: Player.JSON[], page: number, player: Player) {
    const sliced = Array.from(players).slice((page - 1) * 10, (page - 1) * 10 + 10)
        .map((p, i) => {
            if (i & 1) return [{ name: "\u200b", value: "\u200b", inline: true }, { name: `#${i + 1} - ${p.name}`, value: `Lvl ${p.level} (${p.experience}xp)\n$${p.balance + p.bank}`, inline: true }];
            else return { name: `#${i + 1} - ${p.name}`, value: `Lvl ${p.level} (${p.experience}xp)\n$${p.balance + p.bank}`, inline: true };
        }).flat();

    return new EmbedBuilder()
        .setTitle(`Leaderboard`)
        .setColor("Random")
        .setDescription(`You are #${players.findIndex(p => p.id === player.id) + 1}/${await globalEcon.size}`)
        .addFields(sliced)
        .setFooter({ text: `Page ${page} / ${Math.ceil(await globalEcon.size / 10)}` })
};