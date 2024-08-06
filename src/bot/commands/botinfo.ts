import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { getPackageJSONData, Modules, randomEmbed } from "../../lib/library.js";
import prettyMilliseconds from "pretty-ms";

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
        const embed = randomEmbed()
            .setTitle(client.user.username)
            .setDescription(`Online for ${prettyMilliseconds(client.uptime)}!`)
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
