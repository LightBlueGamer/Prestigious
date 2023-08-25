/** @format */

import { EmbedBuilder, GuildMember } from "discord.js";
import { getOrdinal } from "../utils/misc.js";

export default {
    name: "guildMemberAdd",
    once: false,
    async execute(member: GuildMember) {
        const channel = member.client.channels.cache.get("970383430971953152")!;
        const memberCount = `${member.guild.memberCount}${getOrdinal(
            member.guild.memberCount
        )}`;

        const embed = new EmbedBuilder()
            .setTitle(`Welcome ${member.displayName}!`)
            .setDescription(
                `Please read through the rules in <#952980843192811570>.`
            )
            .setColor("Random")
            .setFooter({ text: `You are the ${memberCount} member!` });

        if (channel.isTextBased()) channel.send({ embeds: [embed] });
    },
};
