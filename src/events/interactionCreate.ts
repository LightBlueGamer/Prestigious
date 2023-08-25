/** @format */

import { InteractionType, type BaseInteraction } from "discord.js";

export default {
    name: "interactionCreate",
    once: false,
    async execute(interaction: BaseInteraction) {
        const { user } = interaction;
        if (user.bot) return;

        if (interaction.isChatInputCommand())
            return interaction.client.emit(
                "chatInputCommandInteraction",
                interaction
            );
        if (interaction.isAutocomplete())
            return interaction.client.emit(
                "autoCompleteInteraction",
                interaction
            );

        if (interaction.type === InteractionType.ModalSubmit)
            return interaction.client.emit("modalSubmit", interaction);
        else return;
    },
};
