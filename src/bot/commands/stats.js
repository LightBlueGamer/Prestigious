import { AttachmentBuilder, SlashCommandBuilder } from 'discord.js';
import { Player } from '../../lib/structures/Player';
import Canvas from '@napi-rs/canvas';
import { request } from 'undici';

export default {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Check player stats.')
        .addUserOption((option) => option.setName('user').setDescription('The user to check the stats of.'))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const userBanner = (await interaction.client.users.fetch(user.id)).bannerURL({ format: 'jpg' })
        const player = await Player.get(user.id);
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');
        const backgroundImage = new Canvas.Image();
        const rndColor = randomColor();
        const txtColor = invertColor(rndColor, true);

        if(userBanner) {
            backgroundImage.src = userBanner;
            context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
        } else {
            context.fillStyle = rndColor;
            context.fillRect(0, 0, canvas.width, canvas.height)
        }
        
        const userPx = applyText(canvas, `${user.username}'s stats`)
        context.font = userPx
        context.fillStyle = txtColor;
        context.fillText(`${user.username}'s stats`, canvas.width / 2.5, canvas.height / 3.5);

        context.font = 'bold 30px sans-serif';
        const height = canvas.height / 2.25
        context.fillText(`Prestige: ${player.prestige}`, canvas.width / 2.5, height);
        context.fillText(`Level: ${player.level}`, canvas.width / 2.5, height + 30);
        context.fillText(`Experience: ${player.xp}`, canvas.width / 2.5, height + 60);
        context.fillText(`Coins: ${player.coins}`, canvas.width / 2.5, height + 90);

        const percentage = Math.floor((player.xp / player.requiredXp()) * 100);
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
            context.arc(250 + (i * 6.5), canvas.height - 20, 8, Math.PI * 2, 0, false)
            context.stroke()
        }

        context.font = 'bold 15px sans-serif';
        context.fillStyle = '#ffffff';
        context.fillText(`${player.xp}/${player.requiredXp()} | ${((player.xp/player.requiredXp())*100).toFixed(2)}%`, 245, canvas.height - 15);

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const { body } = await request(user.displayAvatarURL({ format: 'jpg', size: 4096 }));
        const avatar = new Canvas.Image();
        avatar.src = Buffer.from(await body.arrayBuffer());
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

        interaction.editReply({files: [attachment], allowedMentions: {
            repliedUser: player.ping
        }})
    }
}

function applyText(canvas, text) {
    const context = canvas.getContext('2d');
    let fontSize = 55;

    do {
        context.font = `bold ${fontSize -= 10}px sans-serif`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
}

function randomColor() {
    let color = '#';
    for (let i = 0; i < 6; i++){
       const random = Math.random();
       const bit = (random * 16) | 0;
       color += (bit).toString(16);
    }

    return color;
}

function invertColor(hex, bw) {
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }

    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }

    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);

    if (bw) {
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }

    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);

    return "#" + padZero(r) + padZero(g) + padZero(b);
}