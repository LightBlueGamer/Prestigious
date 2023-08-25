import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from "discord.js";
import { Player } from "../lib/game/Player.js";
import { firstLetterUppercase } from "../utils/misc.js";
export default {
    devMode: true,
    data: new SlashCommandBuilder()
        .setName("backpack")
        .setDescription("Shows the backpack of selected user")
        .addUserOption((option) =>
            option
                .setName(`user`)
                .setDescription(`The user to show the profile of`)
        )
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client, options } = interaction;
        const userOption = options.getUser("user")
            ? options.getUser("user", true)
            : user;

        await interaction.deferReply();

        const player = await Player.get(userOption.id, client);
        const backpack = player.getBackpack();
        const inventory =
            backpack.getItemCount() > 0
                ? backpack
                      .getItems()
                      .map((item) => {
                          return `**${item.rarity.name}** ${item.name}: ${item.description} - ${item.size}`;
                      })
                      .join("\n")
                : `You don't currently have any items in your backpack`;

        const embed = new EmbedBuilder()
            .setTitle(
                player.name.endsWith(`s`)
                    ? `${firstLetterUppercase(player.name)} backpack`
                    : `${firstLetterUppercase(player.name)}'s backpack`
            )
            .setDescription(inventory)
            .setFooter({
                text: `${backpack.getItemCount()}/${backpack.getSlots()} slots filled`,
            });

        return interaction.editReply({ embeds: [embed] });
    },
};
