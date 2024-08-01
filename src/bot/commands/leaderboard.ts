import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import {
    calculateGeneralRanking,
    generateLeaderboardFields,
    Modules,
    Player,
} from "../../lib/library.js";
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
        const user = interaction.user;
        const keys = await players.keys;
        const playerList: Player[] = await Promise.all(
            keys.map(async (key) => Player.fromJSON(await players.get(key)))
        );

        if (page <= 0) page = 1;
        const totalPages = Math.ceil(playerList.length / 10);
        if (page > totalPages) page = totalPages;

        let sorted: Player[];
        if (type === "levels") {
            sorted = [...playerList].sort(
                (a, b) =>
                    b.data.prestige - a.data.prestige ||
                    b.data.level - a.data.level ||
                    b.data.xp - a.data.xp
            );
        } else if (type === "balance") {
            sorted = [...playerList].sort(
                (a, b) => b.data.balance - a.data.balance
            );
        } else {
            sorted = calculateGeneralRanking(playerList);
        }

        const embedFields = generateLeaderboardFields(sorted, user, type, page);

        const embed = new EmbedBuilder()
            .setTitle(
                `Top ${(page - 1) * 10 + sorted.slice((page - 1) * 10, (page - 1) * 10 + 10).length} players`
            )
            .setDescription(
                `You are #${sorted.findIndex((p) => p.name === user.username) + 1}`
            )
            .setFooter({
                text: `Page ${page}/${totalPages}`,
            })
            .addFields(embedFields)
            .setColor("Random");

        return interaction.editReply({ content: "", embeds: [embed] });
    },
};
