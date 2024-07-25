import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Modules, Player, greenEmbed } from "../../lib/library.js";

export default {
    devMode: false,
    module: Modules.Economy,
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Pay another user money")
        .setDMPermission(false)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user whom you want to pay.")
                .setRequired(true)
        )
        .addNumberOption((option) =>
            option
                .setName("amount")
                .setDescription("The amount you want to pay.")
                .setRequired(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { options, user, client } = interaction;

        const toPay = options.getUser("user")!;
        const amount = options.getNumber("amount")!;

        if (amount < 1)
            return interaction.reply({
                content: `You must pay a minimum of $1!`,
            });

        if (toPay?.bot)
            return interaction.reply({
                content: `You can't pay a bot money!`,
            });

        if (toPay.id === user.id)
            return interaction.reply({
                content: `You can't pay yourself money!`,
            });

        const playerToPay = await Player.get(toPay.id, client);
        const player = await Player.get(user.id, client);

        if (player.getBalance() < amount)
            return interaction.reply({
                content: `You don't have enough money to pay ${toPay.displayName} $${amount}!`,
            });

        player.payToUser(playerToPay, amount).save();

        const embed = greenEmbed()
            .setTitle("Transfer successful!")
            .setDescription(
                `You have successfully transferred $${amount} to ${toPay.displayName}!`
            )
            .addFields([
                {
                    name: "New Balance",
                    value: `$${player.getBalance()}`,
                    inline: true,
                },
            ]);

        return interaction.reply({
            embeds: [embed],
        });
    },
};
