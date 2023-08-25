/** @format */

import { EmbedBuilder, type ModalSubmitInteraction } from "discord.js";

export default {
    name: "modalSubmit",
    once: false,
    async execute(interaction: ModalSubmitInteraction) {
        const { fields, guild, user } = interaction;
        const announcement = fields.getTextInputValue("ancMessage");
        const member = await guild?.members.fetch(user.id);

        const embed = new EmbedBuilder()
            .setTitle(`Announcement`)
            .setDescription(announcement)
            .setFooter({ text: `Announced by: ${member?.displayName}` })
            .setColor("Random");

        return interaction.reply({
            embeds: [embed],
        });
    },
};
