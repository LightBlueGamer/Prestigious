import { InventoryItem } from "./../lib/game/InventoryItem.js";
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { Player } from "../lib/game/Player.js";
import { Items } from "../lib/game/Catalog.js";
import { getRandomItem } from "../utils/misc.js";

const cooldown = new Set();

export default {
    devMode: true,
    data: new SlashCommandBuilder()
        .setName("scavenge")
        .setDescription("Scavenge for item based on your scavenging level")
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client } = interaction;

        await interaction.deferReply();

        if(cooldown.has(user.id)) return interaction.editReply({
            content: `You must wait until you can scavenge again.`
        });

        cooldown.add(user.id);
        setTimeout(() => {
            cooldown.delete(user.id);
        }, 1000 * 60 * 5);

        const player = await Player.get(user.id, client);
        const { scavenge } = player.getStats();
        const items = Object.values(Items).filter(
            (x) => x.scavenge <= scavenge
        );
        const item = InventoryItem.createInventoryItem(getRandomItem(items), 1);

        if(player.getBackpack().isFull()) return interaction.editReply({
            content: `Your backpack is full and you can't put more items in it, consider upgrading your backpack.`
        });

        player.addItem(item).save();

        const embed = new EmbedBuilder()
            .setTitle(item.name)
            .setDescription(item.description)
            .addFields(
                { name: "Rarity", value: item.rarity.name, inline: true },
                { name: "Size", value: item.size.toString(), inline: true }
            );

        return interaction.editReply({
            content: `You scavenge for resources...`,
            embeds: [embed],
        });
    },
};
