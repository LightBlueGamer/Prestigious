import { EmbedBuilder, type EmbedField } from "discord.js";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Player } from "../lib/game/Player.js";
import { firstLetterUppercase } from "../utils/misc.js";
export default {
    devMode: false,
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Show a users player profile")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to show the profile of")
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client, options } = interaction;
        const userOption = options.getUser("user")
            ? options.getUser("user", true)
            : user;
        await interaction.deferReply();

        const player = await Player.get(userOption.id, client);
        const embedFields: EmbedField[] = [];

        Object.entries(player.data.stats).forEach((stat) => {
            embedFields.push({
                name: stat[0],
                value: stat[1].toString(),
                inline: true,
            });
        });

        const embed = new EmbedBuilder()
            .setTitle(
                player.name.endsWith(`s`)
                    ? `${firstLetterUppercase(player.name)} profile`
                    : `${firstLetterUppercase(player.name)}'s profile`
            )
            .addFields(embedFields)
            .setDescription(
                `Prestige: ${player.showPrestige()} - Level: ${player.showLevel()} - Exp: ${player.showExp()}
                ${player.showExp()}/${player.getExpRequired()} exp - ${player.getExpLeft()} exp left
                :moneybag: $${player.showBalWallet()} - :bank: $${player.showBalBank()}
                `
            )
            .setColor("Random");

        await interaction.editReply({
            embeds: [embed],
        });
    },
};
