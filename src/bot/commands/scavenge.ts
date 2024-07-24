import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Player } from "../../lib/game/Player.js";
import { getRandomItemByWeight } from "../../utils/functions.js";
import { greenEmbed } from "../../utils/embeds.js";
import * as items from "../../game/items.js";
import { Modules } from "../../lib/bot/Modules.js";
const cooldown = new Set();

const scavenge = Object.values(items).filter((item) => item.canScavenge);

export default {
    devMode: false,
    module: Modules.Economy,
    data: new SlashCommandBuilder()
        .setName("scavenge")
        .setDescription("Scavenge for items nearby")
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        const { user, client } = interaction;
        const player = await Player.get(user.id, client);

        if (!cooldown.has(user.id)) {
            const itemList = scavenge.filter(
                (item) => item.size <= player.getBackpack().getFreeSpace()
            );
            const item = getRandomItemByWeight(itemList);

            player.addStatistic("Times scavenged").addItem(item).save();

            const embed = greenEmbed()
                .setTitle(`You found an item!`)
                .setDescription(`1x ${item.name}`);

            interaction.editReply({
                embeds: [embed],
            });

            cooldown.add(user.id);
            setTimeout(
                () => {
                    cooldown.delete(user.id);
                },
                1000 * 60 * 5
            );
        } else
            return interaction.editReply({
                content: `You can't scavenge again just yet!`,
            });
        return;
    },
};
