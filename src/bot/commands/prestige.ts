import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Modules, Player } from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Economy,
    data: new SlashCommandBuilder()
        .setName("prestige")
        .setDescription(
            "Prestige to the reset your experience and start from anew with upgrades."
        )
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client } = interaction;
        await interaction.deferReply();
        const player = await Player.get(user.id, client);

        if (player.canPrestige) {
            player.increasePrestige().save();
            await interaction.editReply({
                content: `You have prestiged to P${player.prestige}!`,
            });
        } else {
            await interaction.editReply({
                content: `You cannot prestige yet, you need ${20 - player.level} more levels to prestige!`,
            });
        }
    },
};
