import { ChatInputCommandInteraction, EmbedField, SlashCommandBuilder } from 'discord.js';
import { economy } from '../database/index.js';
import { EmbedBuilder } from '@discordjs/builders';
export default {    
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows the Prestigious leaderboard")
        .addNumberOption(option => option.setName('page').setDescription('The page to show.'))
        .setDMPermission(false),
    async execute (interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { user } = interaction;
        const pageNum = interaction.options.getNumber('page') || 1;
        const playerList = Array.from(await economy.values);
        const page = (pageNum || 1) * 10 > playerList.length ? Math.ceil(playerList.length / 10) : pageNum < 0 ? 1 : pageNum;
        const sorted = playerList.sort((a, b) => b.prestige - a.prestige || b.level - a.level || b.experience - a.experience || (b.balance + b.bank) - (a.balance - a.bank)),
        sliced = sorted.slice((page - 1) * 10, (page - 1) * 10 + 10),
        embedFields: EmbedField[] = [];

        for(let i = 0; i < sliced.length; i++) {
            const p = sliced[i];
            const name = p.name === user.username ? `#${i+((page-1) * 10)+1} ${p.name} (You)` : `#${i+((page-1) * 10)+1} ${p.name}`;
            if(i & 1) {
                embedFields.push({
                    name: `\u200b`,
                    value: `\u200b`,
                    inline: true,
                });

                embedFields.push({
                    name,
                    value: `Prestige: ${p.prestige}\nLevel: ${p.level}\nXP: ${p.experience}\nBalance: ${p.balance} - Bank: ${p.bank}`,
                    inline: true
                });
            } else {
                embedFields.push({
                    name,
                    value: `Prestige: ${p.prestige}\nLevel: ${p.level}\nXP: ${p.experience}\nBalance: ${p.balance} - Bank: ${p.bank}`,
                    inline: true
                });
            }
        }

        const embed = new EmbedBuilder()
            .setTitle(`Top ${(page - 1) * 10 + 10} players`)
            .setDescription(`You are #${sorted.indexOf(playerList.find(p => p.name === user.username)!) + 1}`)
            .setFooter({text: `Page ${page}/${Math.ceil(playerList.length / 10)}`})
            .addFields(embedFields);
        
        return interaction.editReply({embeds: [embed]});
    }
};