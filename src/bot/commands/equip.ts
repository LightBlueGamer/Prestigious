import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import {
    findItem,
    itemIsEquipment,
    Modules,
    Player,
    randomEmbed,
} from "../../lib/library.js";

export default {
    devMode: true,
    module: Modules.Fun,
    data: new SlashCommandBuilder()
        .setName("equip")
        .setDescription("Equip gear to increase your stats and become stronger")
        .setDMPermission(false)
        .addStringOption((option) =>
            option
                .setName("equipment")
                .setDescription("The equipment to equip yourself with")
                .setAutocomplete(true)
                .setRequired(true)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const { user, client, options } = interaction;
        const equipment = options.getString("equipment", true);
        const item = findItem(equipment);
        if (!item)
            return interaction.reply({
                content: `The item ${equipment} does not exist.`,
            });
        if (!itemIsEquipment(item))
            return interaction.reply({
                content: `${item.name} is not an equippable item.`,
            });
        const player = await Player.get(user.id, client);
        player.equip(item).save();
        const playerEq = player.getEquipment();
        const eqEmbed = randomEmbed()
            .setTitle("Equipment")
            .addFields([
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: true,
                },
                {
                    name: "Helmet",
                    value: `${playerEq.helmet ? playerEq.helmet.name : "None"}`,
                    inline: true,
                },
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: true,
                },
                {
                    name: "Weapon",
                    value: `${playerEq.weapon ? playerEq.weapon.name : "None"}`,
                    inline: true,
                },
                {
                    name: "Cuirass",
                    value: `${playerEq.cuirass ? playerEq.cuirass.name : "None"}`,
                    inline: true,
                },
                {
                    name: "Shield",
                    value: `${playerEq.shield ? playerEq.shield.name : "None"}`,
                    inline: true,
                },
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: true,
                },
                {
                    name: "Leg Armor",
                    value: `${playerEq.legArmor ? playerEq.legArmor.name : "None"}`,
                    inline: true,
                },
                {
                    name: "\u200b",
                    value: "\u200b",
                    inline: true,
                },
            ]);
        return interaction.reply({
            content: `You have equipped ${item.name}`,
            embeds: [eqEmbed],
        });
    },
};