import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
} from "discord.js";
import { backpackEmbed, Modules, Player } from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Fun,
    data: new SlashCommandBuilder()
        .setName("backpack")
        .setDescription("Shows your backpack")
        .setDMPermission(false)
        .addNumberOption((option) =>
            option
                .setName("page")
                .setDescription("The page of the backpack to view")
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client, options } = interaction;
        await interaction.deferReply();
        let pg = options.getNumber("page") || 1;

        const player = await Player.get(user.id, client);

        const generateResponse = async (page: number) => {
            const embed = backpackEmbed(player.backpack, page);
            const maxPages = Math.ceil(player.backpackContent.length / 10);
            const prevPage = page > 1 ? page - 1 : maxPages;
            const nextPage = page < maxPages ? page + 1 : 1;

            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId(`previous_page_${prevPage}`)
                    .setLabel("Previous")
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId(`next_page_${nextPage}`)
                    .setLabel("Next")
                    .setStyle(ButtonStyle.Primary)
            );

            await interaction.editReply({ embeds: [embed], components: [row] });
        };

        await generateResponse(pg);

        const collector = interaction.channel!.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000,
        });

        collector.on("collect", async (i) => {
            if (i.user.id !== user.id) return;
            await i.deferUpdate();

            if (i.customId.startsWith("previous_page_")) {
                pg = parseInt(i.customId.split("_")[2], 10);
            } else if (i.customId.startsWith("next_page_")) {
                pg = parseInt(i.customId.split("_")[2], 10);
            }

            return await generateResponse(pg);
        });

        collector.on("end", () => {
            interaction.editReply({ components: [] });
        });
    },
};
