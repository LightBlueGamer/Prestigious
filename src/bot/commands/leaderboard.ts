import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
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

        const page = Math.max(interaction.options.getNumber("page") || 1, 1);
        const type = interaction.options.getString("type") || "levels";
        const user = interaction.user;

        const playerList = await fetchPlayerList();

        const totalPages = Math.ceil(playerList.length / 10);

        const clampedPage = Math.min(page, totalPages);

        await generateAndSendLeaderboard(
            interaction,
            playerList,
            clampedPage,
            type,
            user,
            totalPages
        );
    },
};

async function fetchPlayerList(): Promise<Player[]> {
    const keys = await players.keys;
    return Promise.all(
        keys.map(async (key) => Player.fromJSON(await players.get(key)))
    );
}

async function generateAndSendLeaderboard(
    interaction: ChatInputCommandInteraction,
    playerList: Player[],
    page: number,
    type: string,
    user: any,
    totalPages: number
) {
    const sorted = sortPlayers(playerList, type);

    const userRank = sorted.findIndex((p) => p.name === user.username) + 1;
    const userPage = Math.ceil(userRank / 10);

    const embedFields = generateLeaderboardFields(sorted, user, type, page);

    const embed = new EmbedBuilder()
        .setTitle(
            `Top ${(page - 1) * 10 + sorted.slice((page - 1) * 10, (page - 1) * 10 + 10).length} players`
        )
        .setDescription(`You are #${userRank}`)
        .setFooter({
            text: `Page ${page}/${totalPages}`,
        })
        .addFields(embedFields)
        .setColor("Random");

    const actionRow = createActionRow(page, totalPages, userPage);

    const msg = await interaction.editReply({
        content: "",
        embeds: [embed],
        components: [actionRow],
    });

    const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60000,
    });

    collector.on("collect", async (btnInteraction) => {
        if (btnInteraction.user.id !== user.id) return;
        if (!btnInteraction.isButton()) return;

        const [_, targetPage] = btnInteraction.customId.split("_");
        const newPage = parseInt(targetPage, 10);

        await btnInteraction.deferUpdate();

        await generateAndSendLeaderboard(
            interaction,
            playerList,
            newPage,
            type,
            user,
            totalPages
        );
    });

    collector.on("end", () => {
        interaction.editReply({ components: [] });
    });
}

function sortPlayers(playerList: Player[], type: string): Player[] {
    if (type === "levels") {
        return playerList.sort(
            (a, b) =>
                b.data.prestige - a.data.prestige ||
                b.data.level - a.data.level ||
                b.data.xp - a.data.xp
        );
    } else if (type === "balance") {
        return playerList.sort((a, b) => b.data.balance - a.data.balance);
    } else {
        return calculateGeneralRanking(playerList);
    }
}

function createActionRow(page: number, totalPages: number, userPage: number) {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId(`leaderboard_prev_${Math.max(1, page - 1)}`)
            .setLabel("Previous Page")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === 1),
        new ButtonBuilder()
            .setCustomId(`leaderboard_next_${Math.min(totalPages, page + 1)}`)
            .setLabel("Next Page")
            .setStyle(ButtonStyle.Primary)
            .setDisabled(page === totalPages),
        new ButtonBuilder()
            .setCustomId(`leaderboard_user_${userPage}`)
            .setLabel(`Your Page`)
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(userPage === page)
    );
}
