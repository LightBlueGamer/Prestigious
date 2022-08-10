import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, UserContextMenuCommandInteraction } from 'discord.js';

export default {
    data: {
        name: 'user configuration',
        type: 2,
    },
    async execute(interaction: UserContextMenuCommandInteraction) {
        const modal = new ModalBuilder()
            .setCustomId('userConfig')
            .setTitle('User Configuration');

        const colorInput = new TextInputBuilder()
            .setCustomId('colorInput')
            .setLabel('Preferred color, must be valid HEX or RGB(A)')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const pingInput = new TextInputBuilder()
            .setCustomId('pingInput')
            .setLabel('Turn ping on/off')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const displayNameInput = new TextInputBuilder()
            .setCustomId('displayNameInput')
            .setLabel('Displayname to show instead of username')
            .setRequired(false)
            .setStyle(TextInputStyle.Short);

        const colorRow = new ActionRowBuilder<TextInputBuilder>().addComponents(colorInput);
        const pingRow = new ActionRowBuilder<TextInputBuilder>().addComponents(pingInput);
        const displayNameRow = new ActionRowBuilder<TextInputBuilder>().addComponents(displayNameInput);

        modal.addComponents(colorRow, pingRow, displayNameRow);

        await interaction.showModal(modal);
    },
};
