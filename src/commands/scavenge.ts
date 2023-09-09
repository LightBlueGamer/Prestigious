import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { Player } from "../lib/game/Player.js";
import { Items } from "../lib/game/Catalog.js";
import { getRandomItem } from "../utils/misc.js";
export default {
    devMode: true,
    data: new SlashCommandBuilder()
        .setName("scavenge")
        .setDescription("Scavenge for item based on your scavenging level")
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client } = interaction;
        const player = await Player.get(user.id, client);
        const { scavenge } = player.getStats();
        const items = Object.values(Items).filter(
            (x) => x.scavenge <= scavenge
        );
        const item = getRandomItem(items);
        await interaction.deferReply();

        player.addItem(item).save();

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setDescription(item.description)
            .addFields(
                { name: "Rarity", value: item.rarity.name, inline: true },
                { name: "Size", value: item.size.toString(), inline: true }
            );

        interaction.editReply({
            content: `You scavenge for resources...`,
            embeds: [embed],
        });
    },
};
