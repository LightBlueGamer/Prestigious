import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getPackageJSONData, Modules, randomEmbed } from "../../lib/library.js";
import prettyMilliseconds from "pretty-ms";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    devMode: false,
    module: Modules.Information,
    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Shows information about the bot")
        .setDMPermission(true)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { client } = interaction;
        await interaction.deferReply();
        const { version } = getPackageJSONData();
        const uptime = getStartJSON().time;
        const embed = randomEmbed()
            .setTitle(client.user.username)
            .setDescription(
                `Online for ${prettyMilliseconds(new Date().getTime() - uptime, { verbose: true, secondsDecimalDigits: 0 })}!`
            )
            .addFields([
                {
                    name: "Shards",
                    value: client.ws.shards.size.toString(),
                    inline: true,
                },
                {
                    name: "Servers",
                    value: client.guilds.cache.size.toString(),
                    inline: true,
                },
                {
                    name: "Users",
                    value: client.guilds.cache
                        .reduce((acc, g) => acc + g.memberCount, 0)
                        .toString(),
                    inline: true,
                },
            ])
            .setThumbnail(client.user.avatarURL())
            .setFooter({ text: `Bot Version V${version}` });

        return interaction.editReply({ embeds: [embed] });
    },
};

function getStartJSON(): StartJson {
    const packageJsonPath = join(__dirname, "../startDate.json");
    try {
        const data = readFileSync(packageJsonPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return { time: Date.now(), rewrite: true };
        } else {
            throw error;
        }
    }
}
