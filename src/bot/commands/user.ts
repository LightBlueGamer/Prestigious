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

        const content = player.hasStatPoints()
            ? `You have available statpoints you can use to improve your attributes! You can increase them with the /attributes command`
            : ``;

        console.log(content);

        interaction.reply({ embeds: [embed], content });
    },
};
