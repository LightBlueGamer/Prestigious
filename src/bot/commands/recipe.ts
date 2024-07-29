import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Modules } from "../../lib/library.js";

export default {
    devMode: true,
    module: Modules.Fun,
    data: new SlashCommandBuilder()
        .setName("recipe")
        .setDescription("View the recipe of an item")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("item")
                .setDescription("The item to display the recipe for")
                .setAutocomplete(true)
                .setRequired(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        return interaction;
    },
};
