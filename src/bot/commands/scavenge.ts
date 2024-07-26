import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    items,
    Modules,
    Player,
    getRandomItemByWeight,
    greenEmbed,
    randomNumber,
} from "../../lib/library.js";
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
        const { user, client } = interaction;
        const player = await Player.get(user.id, client);

        if (!cooldown.has(user.id)) {
            const itemList = scavenge.filter(
                (item) => item.size <= player.getBackpack().getFreeSpace()
            );
            const item = getRandomItemByWeight(itemList);
            const { expBoost } = player.getPrestigeBoosts();
            const xp = Math.floor(
                randomNumber(item.value * 0.25, item.value * 2) * expBoost
            );

            player
                .addStatistic("Times scavenged")
                .addItem(item)
                .modifyXp(Math.floor(xp))
                .save();

            const embed = greenEmbed()
                .setTitle(`You found an item and got ${xp} xp!`)
                .setDescription(`1x ${item.name}`);

            interaction.reply({
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
            return interaction.reply({
                content: `You can't scavenge again just yet!`,
            });
        return;
    },
};
