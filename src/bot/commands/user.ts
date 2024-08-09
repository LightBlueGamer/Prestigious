import {
    AttachmentBuilder,
    ChatInputCommandInteraction,
    GuildMember,
    SlashCommandBuilder,
} from "discord.js";
import {
    applyText,
    backpackEmbed,
    getRandomHexColor,
    invertColor,
    Modules,
    Player,
    randomEmbed,
} from "../../lib/library.js";
import Canvas from "@napi-rs/canvas";
import { request } from "undici";

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
        await interaction.deferReply();
        const user = interaction.options.getUser("user") || interaction.user;

        const player = await Player.get(user.id, interaction.client);
        const member: GuildMember = await interaction.guild!.members.fetch(
            user.id
        );

        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext("2d");
        const color =
            player.bgColor.length > 0 ? player.bgColor : getRandomHexColor();
        const text =
            player.textColor.length > 0
                ? player.textColor
                : invertColor(color, true);

        context.fillStyle = color;
        context.fillRect(0, 0, canvas.width, canvas.height);

        const userPx = applyText(
            canvas,
            `${
                member.displayName.charAt(0).toUpperCase() +
                member.displayName.slice(1)
            }${member.displayName.endsWith("s") ? "'" : "'s"} Profile`
        );
        context.font = userPx;
        context.fillStyle = text;
        context.fillText(
            `${
                member.displayName.charAt(0).toUpperCase() +
                member.displayName.slice(1)
            }${member.displayName.endsWith("s") ? "'" : "'s"} Profile`,
            canvas.width / 2.3,
            canvas.height / 3.5
        );
        context.font = "bold 30px Noto Sans CJK JP";
        const height = canvas.height / 2.25;
        const width = 250;

        context.fillText(`Prestige: ${player.prestige}`, width, height);
        context.fillText(`Level: ${player.level}`, width, height + 30);
        context.fillText(
            `Experience: ${player.xp} — ${player.totalXpBoost}x boost`,
            width,
            height + 60
        );
        context.fillText(
            `Balance: $${player.balance} — ${player.totalMoneyBoost}x boost`,
            width,
            height + 90
        );

        const percentage = Math.floor((player.xp / player.requiredXp) * 100);
        const roundedPercent = Math.round(percentage);

        for (let i = 0; i < 400; i++) {
            context.beginPath();
            context.lineWidth = 14;
            context.strokeStyle =
                player.bgXpColor.length > 0 ? player.bgXpColor : "#000000";
            context.arc(250 + i, canvas.height - 20, 8, Math.PI * 2, 0, false);
            context.stroke();
        }

        for (let i = 0; i < roundedPercent; i++) {
            context.beginPath();
            context.strokeStyle =
                player.xpColor.length > 0 ? player.xpColor : "#008800";
            context.arc(
                250 + i * 4,
                canvas.height - 20,
                8,
                Math.PI * 2,
                0,
                false
            );
            context.stroke();
        }

        context.font = "bold 15px Noto Sans CJK JP";
        context.fillStyle =
            player.textColor.length > 0
                ? player.textColor
                : invertColor(
                      player.xpColor.length > 0 ? player.xpColor : "#008800",
                      true
                  );
        context.fillText(
            `${player.xp}/${player.requiredXp} | ${((player.xp / player.requiredXp) * 100).toFixed(2)}%`,
            245,
            canvas.height - 15
        );

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const { body } = await request(
            user.displayAvatarURL({ extension: "jpg", size: 4096 })
        );
        const avatar = new Canvas.Image();
        avatar.src = Buffer.from(await body.arrayBuffer());
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
            name: "profile-image.png",
        });

        const playerEq = player.equipment;
        const equipment = randomEmbed()
            .setTitle("Equipment")
            .setDescription(
                `Health: ${player.health}\nDamage: ${player.damage} — Armor: ${player.armor}`
            )
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
                    name: "Backpack",
                    value: `${player.backpack.name}`,
                    inline: true,
                },
            ]);

        const content = player.hasStatPoints
            ? `You have available statpoints you can use to improve your attributes! You can increase them with the /attributes command`
            : ``;

        const backpack = backpackEmbed(player.backpack, 1);

        interaction.editReply({
            files: [attachment],
            embeds: [equipment, backpack],
            content,
        });
    },
};
