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
        .addSubcommand((subcommand) => subcommand
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
                .setDescription("The amount by which to increase the attribute. Default to 1")
                .setRequired(false)
                .setMinValue(1)
                .setMaxValue(10)
            )
        )
        .addSubcommand((subcommand) => subcommand
           .setName("show")
           .setDescription("Show your current attributes")
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

        if (subcommand === "show") return interaction.reply({ embeds: [embed] })
        else if(subcommand === "increase") {
            const attribute = options.getString("attribute", true);
            const amount = options.getNumber("amount") || 1;
            const attr = player.getAttribute(attribute);
            if(attr.value >= 10) return interaction.reply({ content: `You can't increase an attribute past 10!` });
            player.increaseAttribute(attribute, amount).save();
           return interaction.reply({ content: `Your ${attr.name} is now ${attr.value}!`, embeds: [embed] });
        } else return interaction.reply({ embeds: [embed] });
    },
};
