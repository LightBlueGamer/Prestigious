import { ChatInputCommandInteraction, EmbedBuilder, EmbedField, SlashCommandBuilder } from "discord.js";
import { players } from "../../database/main";
import { Player } from "../../lib/structures/Player";

export default {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Shows the leaderboard on the specified page.')
        .addStringOption(option => option.setName('type').setDescription('The type of leaderboard to show.').addChoices({name: 'levels', value: 'levels'}, {name: 'balance', value: 'balance'}, {name: 'general', value: 'general'}).setRequired(false))
        .addNumberOption(option => option.setName('page').setDescription('The page to show.'))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        let page = interaction.options.getNumber('page') || 1;
        const type = interaction.options.getString('type') || 'levels';
        const user = interaction.user;
        const player = await Player.get(user.id);
        const keys = await players.keys;
        const playerList: Player[] = [];

        for(const key of keys) {
            playerList.push(Player.fromJSON(await players.get(key)));
        }


        if (page * 10 > playerList.length) page = Math.ceil(playerList.length / 10);
        if (page <= 0) page = 1;
        let sorted: Player[], sliced: Player[], embedFields: EmbedField[];
        if(type === 'levels') {
            sorted = playerList.sort((a, b) => b.prestige - a.prestige || b.level - a.level || b.xp - a.xp)
            sliced = sorted.slice((page - 1) * 10, (page - 1) * 10 + 10);
            embedFields = [];

            for(let i=0; i<sliced.length; i++) {
                const player = sliced[i];
                const name = player.tag === user.tag ? `#${i+((page-1) * 10)+1} ${player.tag} (You)` : `#${i+((page-1) * 10)+1} ${player.tag}`;
                if (i & 1) {
                    embedFields.push({
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    });

                    embedFields.push({
                        name,
                        value: `Prestige: ${player.prestige}\nLevel: ${player.level}\nXP: ${player.xp}\nCoins: ${player.coins}`,
                        inline: true
                    });
                } else {
                    embedFields.push({
                        name,
                        value: `Prestige: ${player.prestige}\nLevel: ${player.level}\nXP: ${player.xp}\nCoins: ${player.coins}`,
                        inline: true
                    });
                }
            }
        } else if(type === 'balance') {
            sorted = playerList.sort((a, b) => b.coins - a.coins);
            sliced = sorted.slice((page - 1) * 10, (page - 1) * 10 + 10);
            embedFields = [];

            for(let i=0; i<sliced.length; i++) {
                const player = sliced[i];
                const name = player.tag === user.tag ? `#${i+((page-1) * 10)+1} ${player.tag} (You)` : `#${i+((page-1) * 10)+1} ${player.tag}`;
                if (i & 1) {
                    embedFields.push({
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    });

                    embedFields.push({
                        name,
                        value: `Coins: ${player.coins}\nPrestige: ${player.prestige}\nLevel: ${player.level}\nXP: ${player.xp}`,
                        inline: true
                    });
                } else {
                    embedFields.push({
                        name,
                        value: `Coins: ${player.coins}\nPrestige: ${player.prestige}\nLevel: ${player.level}\nXP: ${player.xp}`,
                        inline: true
                    });
                }
            }
        } else if(type === 'general') {
            const playerListXP: Player[] = [];
            for(const key of keys) {
                playerListXP.push(Player.fromJSON(await players.get(key)));
            }
            const sortedXP = playerListXP.sort((a, b) => b.prestige - a.prestige || b.level - a.level || b.xp - a.xp);
            const sortedCoins = playerList.sort((a, b) => b.coins - a.coins);
            console.log(sortedXP[0].tag, sortedCoins[0].tag);
            const sorted = playerList.map(x => {
                const player: any = x;
                player.value = Math.floor(((sortedXP.findIndex(y => y.tag === x.tag) + 1) + (sortedCoins.findIndex(y => y.tag === x.tag) + 1)) / 2);
                return player;
            }).sort((a, b) => {
                return a.value - b.value || b.prestige - a.prestige || b.level - a.level || b.xp - a.xp || b.coins - a.coins;
            });
            const sliced = sorted.slice((page - 1) * 10, (page - 1) * 10 + 10);
            embedFields = [];

            for(let i=0; i<sliced.length; i++) {
                const player = sliced[i];
                const name = player.tag === user.tag ? `#${i+((page-1) * 10)+1} ${player.tag} (You)` : `#${i+((page-1) * 10)+1} ${player.tag}`;
                if (i & 1) {
                    embedFields.push({
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    });

                    embedFields.push({
                        name,
                        value: `Prestige: ${player.prestige}\nLevel: ${player.level}\nXP: ${player.xp}\nCoins: ${player.coins}`,
                        inline: true
                    });
                } else {
                    embedFields.push({
                        name,
                        value: `Prestige: ${player.prestige}\nLevel: ${player.level}\nXP: ${player.xp}\nCoins: ${player.coins}`,
                        inline: true
                    });
                }
            }

            const embed = new EmbedBuilder()
            .setTitle(`Top ${(page - 1) * 10 + 10} players`)
            .setDescription(`You are #${sorted!.indexOf(playerList.find(p => p.tag === user.tag)!) + 1}`)
            .setFooter({text: `Page ${page}/${Math.ceil(playerList.length / 10)}`})
            .addFields(embedFields!);

            return interaction.editReply({embeds: [embed], allowedMentions: {
                repliedUser: player.ping,
            }});
        }

        const embed = new EmbedBuilder()
            .setTitle(`Top ${(page - 1) * 10 + 10} players`)
            .setDescription(`You are #${sorted!.indexOf(playerList.find(p => p.tag === user.tag)!) + 1}`)
            .setFooter({text: `Page ${page}/${Math.ceil(playerList.length / 10)}`})
            .addFields(embedFields!);

        return interaction.editReply({embeds: [embed], allowedMentions: {
            repliedUser: player.ping,
        }});
    }
}