import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    EmbedBuilder,
} from "discord.js";
import { Modules } from "../../lib/library.js";
import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";
import "dotenv/config";
import type { PlayerDocument } from "../../lib/interfaces/PlayerDocument.js";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.bjnb7xh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const collectionName = "Prestigious";

let client: MongoClient;
let db: Db;
let collection: Collection<PlayerDocument>;

async function connectToMongoDB() {
    if (!client) {
        client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            },
        });
        await client.connect();
        db = client.db("josh");
        collection = db.collection(collectionName.toLowerCase());
    }
}

export default {
    devMode: false,
    module: Modules.Fun,
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows the leaderboard on the specified page.")
        .addNumberOption((option) =>
            option.setName("page").setDescription("The page to show.")
        )
        .addStringOption((option) =>
            option
                .setName("type")
                .setDescription(
                    "Whether to show the Experience or Balance leaderboard. Defaults to XP"
                )
                .addChoices(
                    { name: "Experience", value: "experience" },
                    { name: "Balance", value: "balance" }
                )
        )
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ content: "Fetching leaderboard..." });

        const page = Math.max(interaction.options.getNumber("page") || 1, 1);
        const type = interaction.options.getString("type") || "experience";

        await connectToMongoDB();

        const sortCriteria =
            type === "experience"
                ? {
                      "value.data.prestige": -1,
                      "value.data.level": -1,
                      "value.data.xp": -1,
                  }
                : { "value.data.balance": -1 };
        const pageSize = 10;

        console.log(await collection.countDocuments());

        const totalPlayers = await collection.countDocuments();
        const totalPages = Math.ceil(totalPlayers / pageSize);

        const clampedPage = Math.max(Math.min(page, totalPages), 1);

        const players = await fetchPlayerList(
            clampedPage,
            pageSize,
            sortCriteria
        );

        await generateAndSendLeaderboard(
            interaction,
            players,
            clampedPage,
            type,
            totalPages
        );
    },
};

async function fetchPlayerList(
    page: number,
    pageSize: number,
    sortCriteria: any
): Promise<LeaderboardPlayer[]> {
    const skip = (page - 1) * pageSize;
    const playersCursor = collection
        .find({})
        .sort(sortCriteria)
        .skip(skip)
        .limit(pageSize);

    const playersArray: PlayerDocument[] = await playersCursor.toArray();

    return playersArray.map((playerData) => {
        return {
            username: playerData.value.name,
            xp: playerData.value.data.xp,
            balance: playerData.value.data.balance,
            level: playerData.value.data.level,
            prestige: playerData.value.data.prestige,
            id: playerData.key,
        };
    });
}

async function generateAndSendLeaderboard(
    interaction: ChatInputCommandInteraction,
    players: LeaderboardPlayer[],
    page: number,
    type: string,
    totalPages: number
) {
    const embedFields = players.flatMap((player, index) => {
        const rank = index + (page - 1) * 10 + 1;
        const name =
            player.id === interaction.user.id
                ? `#${rank} ${player.username} (You)`
                : `#${rank} ${player.username}`;
        const value =
            type === "experience"
                ? `Prestige: ${player.prestige}\nLevel: ${player.level}\nExp: ${player.xp}`
                : `Balance: ${player.balance}`;

        if (index % 2 === 0) {
            return [
                {
                    name,
                    value,
                    inline: true,
                },
            ];
        } else {
            return [
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: true,
                },
                {
                    name,
                    value,
                    inline: true,
                },
            ];
        }
    });

    const embed = new EmbedBuilder()
        .setTitle(`Top ${(page - 1) * 10 + players.length} Players`)
        .setDescription(`Showing page ${page} of ${totalPages}`)
        .addFields(embedFields)
        .setFooter({ text: `Page ${page}/${totalPages}` })
        .setColor("Random");

    await interaction.editReply({
        content: "",
        embeds: [embed],
    });
}
