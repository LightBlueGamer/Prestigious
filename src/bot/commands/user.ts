import {
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from "discord.js";
import { Modules, Player, randomEmbed } from "../../lib/library.js";

export default {
    devMode: false,
    userContext: true,
    module: Modules.Economy,
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Shows your user profile")
        .setDMPermission(false)
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user whose profile you want to view")
                .setRequired(false)
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        const user = interaction.options.getUser("user") || interaction.user;

        const player = await Player.get(user.id, interaction.client);

        const member: GuildMember = await interaction.guild!.members.fetch(
            user.id
        );

        const embed = randomEmbed()
            .setTitle(
                `${
                    member.displayName.charAt(0).toUpperCase() +
                    member.displayName.slice(1)
                }${member.displayName.endsWith("s") ? "'" : "'s"} Profile`
            )
            .addFields([
                {
                    name: "Prestige",
                    value: player.data.prestige.toString(),
                    inline: true,
                },
                {
                    name: "Level",
                    value: player.data.level.toString(),
                    inline: true,
                },
                {
                    name: "Balance",
                    value: "$" + player.data.balance.toString(),
                    inline: true,
                },
            ])
            .setDescription(
                `${player.data.xp}/${player.xpRequired()} xp\n${player.generateBar()}\n\n**(${player.getBackpackContents().reduce((p, c) => p + c.amount * c.size, 0)}/${player.getBackpack().slots}) Backpack:**\n\`\`\`` +
                    player.data.backpack.contents
                        .map((item) => {
                            return `\n${item.amount}x ${item.name}`;
                        })
                        .join("\n") +
                    "\u200b```"
            );

        const playerEq = player.getEquipment();

        const equipment = randomEmbed()
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

        const content = player.hasStatPoints()
            ? `You have available statpoints you can use to improve your attributes! You can increase them with the /attributes command`
            : ``;

        interaction.reply({ embeds: [embed, equipment], content });
    },
};
