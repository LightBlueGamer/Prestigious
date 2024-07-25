import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    Modules,
    Player,
    Lootbox,
    redEmbed,
    greenEmbed,
} from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Economy,
    data: new SlashCommandBuilder()
        .setName("lootbox")
        .setDescription("Open a lootbox.")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("lootbox")
                .setDescription("The lootbox you want to open.")
                .setRequired(true)
                .setAutocomplete(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { options, user, client } = interaction;

        const lootboxName = options.getString("lootbox", true)!;
        const player = await Player.get(user.id, client);
        const lootbox: Lootbox | undefined = player
            .getLootboxes()
            .find((box) => box.name === lootboxName);

        if (!lootbox) {
            const embed = redEmbed().setTitle(
                `You don't have a ${lootboxName} lootbox!`
            );

            return interaction.editReply({
                embeds: [embed],
            });
        }

        const { item } = player.openLootbox(lootbox);

        player.addStatistic("Lootboxes opened").save();

        const embed = greenEmbed()
            .setTitle(`You opened a ${lootbox.name} lootbox!`)
            .setDescription(`You got a ${item.name}!`);

        return interaction.editReply({
            embeds: [embed],
        });
    },
};
