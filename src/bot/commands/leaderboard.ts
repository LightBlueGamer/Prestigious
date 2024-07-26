import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    type EmbedField,
} from "discord.js";
import { Modules, Player } from "../../lib/library.js";
import { db as players } from "../../db/index.js";

export default {
    devMode: false,
    module: Modules.Economy,
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows the leaderboard on the specified page.")
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription("The type of leaderboard to show.")
                .addChoices(
                    { name: "levels", value: "levels" },
                    { name: "balance", value: "balance" },
                    { name: "general", value: "general" }
                )
                .setRequired(false)
        )
        .addNumberOption((option) =>
            option.setName("page").setDescription("The page to show.")
        )
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ content: "Fetching leaderboard..." });
        let page = interaction.options.getNumber("page") || 1;
        const type = interaction.options.getString("type") || "levels";
        const { user } = interaction;
        const keys = await players.keys;
        const playerList: Player[] = [];

        for (const key of keys) {
            playerList.push(Player.fromJSON(await players.get(key)));
        }

        if (page * 10 > playerList.length)
            page = Math.ceil(playerList.length / 10);
        if (page <= 0) page = 1;
        let sorted: Player[], sliced: Player[], embedFields: EmbedField[];
        if (type === "levels") {
            sorted = playerList.sort(
                (a, b) =>
                    b.data.prestige - a.data.prestige ||
                    b.data.level - a.data.level ||
                    b.data.xp - a.data.xp
            );
            sliced = sorted.slice((page - 1) * 10, (page - 1) * 10 + 10);
            embedFields = [];

            for (let i = 0; i < sliced.length; i++) {
                const player = sliced[i];
                const name =
                    player.id === user.id
                        ? `#${i + (page - 1) * 10 + 1} ${player.name} (You)`
                        : `#${i + (page - 1) * 10 + 1} ${player.name}`;
                if (i & 1) {
                    embedFields.push({
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    });

                    embedFields.push({
                        name,
                        value: `Prestige: ${player.data.prestige}\nLevel: ${player.data.level}\nXP: ${player.data.xp}\nBalance: ${player.data.balance}`,
                        inline: true,
                    });
                } else {
                    embedFields.push({
                        name,
                        value: `Prestige: ${player.data.prestige}\nLevel: ${player.data.level}\nXP: ${player.data.xp}\nBalance: ${player.data.balance}`,
                        inline: true,
                    });
                }
            }
        } else if (type === "balance") {
            sorted = playerList.sort((a, b) => b.data.balance - a.data.balance);
            sliced = sorted.slice((page - 1) * 10, (page - 1) * 10 + 10);
            embedFields = [];

            for (let i = 0; i < sliced.length; i++) {
                const player = sliced[i];
                const name =
                    player.id === user.id
                        ? `#${i + (page - 1) * 10 + 1} ${player.name} (You)`
                        : `#${i + (page - 1) * 10 + 1} ${player.name}`;
                if (i & 1) {
                    embedFields.push({
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    });

                    embedFields.push({
                        name,
                        value: `Balance: ${player.data.balance}\nPrestige: ${player.data.prestige}\nLevel: ${player.data.level}\nXP: ${player.data.xp}`,
                        inline: true,
                    });
                } else {
                    embedFields.push({
                        name,
                        value: `Balance: ${player.data.balance}\nPrestige: ${player.data.prestige}\nLevel: ${player.data.level}\nXP: ${player.data.xp}`,
                        inline: true,
                    });
                }
            }
        } else if (type === "general") {
            const playerListXP: Player[] = [];
            for (const key of keys) {
                playerListXP.push(Player.fromJSON(await players.get(key)));
            }
            const sortedXP = playerListXP.sort(
                (a, b) =>
                    b.data.prestige - a.data.prestige ||
                    b.data.level - a.data.level ||
                    b.data.xp - a.data.xp ||
                    b.data.balance - a.data.balance
            );
            const sortedBalance = playerList.sort(
                (a, b) => b.data.balance - a.data.balance
            );
            const sorted = playerList
                .map((x) => {
                    const player: any = x;
                    player.value = Math.floor(
                        (sortedXP.findIndex((y) => y.name === x.name) +
                            1 +
                            (sortedBalance.findIndex((y) => y.name === x.name) +
                                1)) /
                            2
                    );
                    return player;
                })
                .sort((a, b) => {
                    return (
                        a.value - b.value ||
                        b.prestige - a.prestige ||
                        b.level - a.level ||
                        b.xp - a.xp ||
                        b.Balance - a.Balance
                    );
                });
            const sliced = sorted.slice((page - 1) * 10, (page - 1) * 10 + 10);
            embedFields = [];

            for (let i = 0; i < sliced.length; i++) {
                const player = sliced[i];
                const name =
                    player.id === user.id
                        ? `#${i + (page - 1) * 10 + 1} ${player.name} (You)`
                        : `#${i + (page - 1) * 10 + 1} ${player.name}`;
                if (i & 1) {
                    embedFields.push({
                        name: `\u200b`,
                        value: `\u200b`,
                        inline: true,
                    });

                    embedFields.push({
                        name,
                        value: `Prestige: ${player.data.prestige}\nLevel: ${player.data.level}\nXP: ${player.data.xp}\nBalance: ${player.data.balance}`,
                        inline: true,
                    });
                } else {
                    embedFields.push({
                        name,
                        value: `Prestige: ${player.data.prestige}\nLevel: ${player.data.level}\nXP: ${player.data.xp}\nBalance: ${player.data.balance}`,
                        inline: true,
                    });
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(`Top ${(page - 1) * 10 + 10} players`)
                .setDescription(
                    `You are #${sorted!.indexOf(playerList.find((p) => p.name === user.username)!) + 1}`
                )
                .setFooter({
                    text: `Page ${page}/${Math.ceil(playerList.length / 10)}`,
                })
                .addFields(embedFields!);

            return interaction.editReply({ content: "", embeds: [embed] });
        }

        const embed = new EmbedBuilder()
            .setTitle(`Top ${(page - 1) * 10 + 10} players`)
            .setDescription(
                `You are #${sorted!.indexOf(playerList.find((p) => p.name === user.username)!) + 1}`
            )
            .setFooter({
                text: `Page ${page}/${Math.ceil(playerList.length / 10)}`,
            })
            .addFields(embedFields!)
            .setColor("Random");

        return interaction.editReply({ content: "", embeds: [embed] });
    },
};
