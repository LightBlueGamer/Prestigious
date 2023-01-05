import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Player } from '../lib/classes/Player';
import Canvas from '@napi-rs/canvas';
import { randomColor, invertColor, applyText } from '../utils/functions';
import { request } from 'undici';

export default {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Check player profile.')
        .addUserOption((option) => option.setName('user').setDescription('The user to check the profile of.'))
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const user = interaction.options.getUser('user') || interaction.user;
        if(user.bot) return interaction.editReply({content: 'You cannot check the profile of a bot.'});
        const player = await Player.get(user.id, interaction.client);
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');
        const rndColor = randomColor();
        const txtColor = invertColor(rndColor, true);
        
        context.fillStyle = rndColor
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        const userPx = applyText(canvas, `${user.username}'s profile`)
        context.font = userPx
        context.fillStyle = txtColor;
        context.fillText(`${player.name}'s profile`, canvas.width / 2.5, canvas.height / 3.5);

        context.font = 'bold 30px Noto Sans CJK JP';
        const height = canvas.height / 2.25
        context.fillText(`Prestige: ${player.prestige}`, canvas.width / 2.5, height);
        context.fillText(`Level: ${player.level}`, canvas.width / 2.5, height + 30);
        context.fillText(`Experience: ${player.experience}`, canvas.width / 2.5, height + 60);
        context.fillText(`Balance: $${player.balance} - Bank: $${player.bank}`, canvas.width / 2.5, height + 90);

        const percentage = Math.floor((player.experience / player.experienceRequirement()) * 100);
        const roundedPercent = Math.round(percentage);

        for(let i = 0; i < 400; i++) {
            context.beginPath()
            context.lineWidth = 14
            context.strokeStyle = '#000000'
            context.arc(250+i, canvas.height - 20, 8, Math.PI * 2, 0, false)
            context.stroke()
        }

        for(let i = 0; i < roundedPercent; i++) {
            context.beginPath()
            context.strokeStyle = '#008800'
            context.arc(250 + (i * 4), canvas.height - 20, 8, Math.PI * 2, 0, false)
            context.stroke()
        }

        context.font = 'bold 15px Noto Sans CJK JP';
        context.fillStyle = '#ffffff';
        context.fillText(`${player.experience}/${player.experienceRequirement()} | ${((player.experience/player.experienceRequirement())*100).toFixed(2)}%`, 245, canvas.height - 15);

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const { body } = await request(user.displayAvatarURL({ extension: 'jpg', size: 4096 }));
        const avatar = new Canvas.Image();
        avatar.src = Buffer.from(await body.arrayBuffer());
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: `${player.name}-profile.png` });

        return interaction.editReply({files: [attachment]})
    }
};