import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    attributeBar,
    Modules,
    Player,
    randomEmbed,
} from "../../lib/library.js";

export default {
    devMode: true,
    module: Modules.Fun,
    data: new SlashCommandBuilder()
        .setName("attributes")
        .setDescription("Increase/Show your current attributes")
        .setDMPermission(false)
        .addSubcommand((subcommand) =>
            subcommand
                .setName("increase")
                .setDescription("Increase an attribute by a random amount")
                .addStringOption((option) =>
                    option
                        .setName("attribute")
                        .setDescription("The attribute you want to increase")
                        .setRequired(true)
                        .addChoices([
                            { name: "Strength", value: "strength" },
                            { name: "Dexterity", value: "dexterity" },
                            { name: "Intelligence", value: "intelligence" },
                            { name: "Constitution", value: "constitution" },
                            { name: "Charisma", value: "charisma" },
                            { name: "Wisdom", value: "wisom" },
                        ])
                )
                .addNumberOption((option) =>
                    option
                        .setName("amount")
                        .setDescription(
                            "The amount by which to increase the attribute. Default to 1"
                        )
                        .setRequired(false)
                        .setMinValue(1)
                        .setMaxValue(10)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("show")
                .setDescription("Show your current attributes")
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("prestige")
                .setDescription("Increase a prestige attribute")
                .addStringOption((option) =>
                    option
                        .setName("attribute")
                        .setDescription(
                            "The prestige attribute you want to increase"
                        )
                        .setRequired(true)
                        .addChoices([
                            {
                                name: "Experience Boost",
                                value: "ExperienceBoost",
                            },
                            { name: "Money Boost", value: "MoneyBoost" },
                        ])
                )
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client, options } = interaction;
        const player = await Player.get(user.id, client);
        const attributes = player.getAttributes();
        const subcommand = options.getSubcommand();

        const embed = randomEmbed()
            .setTitle(`${user.username}'s attributes`)
            .setDescription(
                "\u200b" +
                    attributes
                        .map(
                            (atr) => `${atr.name}:\n${attributeBar(atr.value)}`
                        )
                        .join("\n\n")
            );

        if (subcommand === "show")
            return interaction.reply({ embeds: [embed] });
        else if (subcommand === "increase") {
            const attribute = options.getString("attribute", true);
            const amount = options.getNumber("amount") || 1;
            const attr = player.getAttribute(attribute);
            if (attr.value >= 10 || attr.value + amount > 10)
                return interaction.reply({
                    content: `You can't increase an attribute past 10!`,
                });
            if (player.getStatPoints() < amount)
                return interaction.reply({
                    content: `You can't increase an attribute with more stat points than you have!`,
                });
            if (!player.getAttributes().find((atr) => atr.name === attribute))
                return interaction.reply({
                    content: `${attribute} is not a valid attribute!`,
                });
            player.increaseAttribute(attribute, amount).save();
            return interaction.reply({
                content: `Your ${attr.name} is now ${attr.value}!`,
                embeds: [embed],
            });
        } else if (subcommand === "prestige") {
            const attribute = options.getString("attribute", true);
            if (player.getPrestigePoints() <= 0)
                return interaction.reply({
                    content: `You need at least 1 prestige point to increase a prestige attribute`,
                });
            if (
                !player
                    .getPrestigeAttributes()
                    .find((atr) => atr.name === attribute)
            )
                return interaction.reply({
                    content: `${attribute} is not a valid attribute!`,
                });
            player.increasePrestigeAttribute(attribute).save();
            return interaction.reply({
                content: `Your ${player.getPrestigeAttribute(attribute).name} is now ${player.getPrestigeAttribute(attribute).value}!`,
            });
        } else return interaction.reply({ embeds: [embed] });
    },
};
