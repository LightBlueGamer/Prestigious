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
        const player = await Player.get(user.id, client);

        if (player.canPrestige()) {
            player.prestige();
            await interaction.reply({
                content: `You have prestiged to P${player.data.prestige}!`,
            });
        } else {
            await interaction.reply({
                content: `You cannot prestige yet, you need ${20 - player.data.level} more levels to prestige!`,
            });
        }
    },
};
