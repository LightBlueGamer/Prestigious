import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    items,
    Modules,
    Player,
    getRandomItemByWeight,
    greenEmbed,
    randomNumber,
} from "../../lib/library.js";
const cooldown = new Map();

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
        const backpack = player.getBackpack();

        if (backpack.getFreeSpace() <= 0)
            return interaction.reply({
                content:
                    "You can't scavenge because you have no free space in your backpack!",
            });

        const now = Date.now();
        const cooldownDuration = 1000 * 60 * 5; // 5 minutes
        const expirationTime = cooldown.get(user.id);

        if (expirationTime && expirationTime > now) {
            const timeLeft = expirationTime - now;
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            return interaction.reply({
                content: `You can't scavenge again just yet! Try again in ${minutes}m ${seconds}s.`,
            });
        }

        const itemList = scavenge.filter(
            (item) => item.size <= player.getBackpack().getFreeSpace()
        );
        const item = getRandomItemByWeight(itemList);
        const { expBoost } = player.getPrestigeBoosts();
        const xp = Math.floor(
            randomNumber(item.value * 0.25, item.value * 2) *
                (1 + 0.0333 * player.getAttribute("int").value) *
                expBoost *
                (player.data.premium ? 2 : 1)
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

        cooldown.set(user.id, now + cooldownDuration);
        setTimeout(() => {
            cooldown.delete(user.id);
        }, cooldownDuration);

        return;
    },
};
