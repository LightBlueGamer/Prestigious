import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
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
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const user = interaction.options.getUser('user') || interaction.user;
        if(user.bot) return interaction.editReply({content: 'You cannot check stats of a bot.'});
        const player = await Player.get(user.id);
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');
        const rndColor = player.color === 'random' ? randomColor() : player.color;
        const txtColor = invertColor(rndColor, true);
        
        context.fillStyle = rndColor
        context.fillRect(0, 0, canvas.width, canvas.height)
        
        const userPx = applyText(canvas, `${user.username}'s stats`)
        context.font = userPx
        context.fillStyle = txtColor;
        context.fillText(`${player.getName()}'s stats`, canvas.width / 2.5, canvas.height / 3.5);

        context.font = 'bold 30px Noto Sans CJK JP';
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
            context.arc(250 + (i * 4), canvas.height - 20, 8, Math.PI * 2, 0, false)
            context.stroke()
        }

        context.font = 'bold 15px Noto Sans CJK JP';
        context.fillStyle = '#ffffff';
        context.fillText(`${player.xp}/${player.requiredXp()} | ${((player.xp/player.requiredXp())*100).toFixed(2)}%`, 245, canvas.height - 15);

        context.beginPath();
        context.arc(125, 125, 100, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const { body } = await request(user.displayAvatarURL({ extension: 'jpg', size: 4096 }));
        const avatar = new Canvas.Image();
        avatar.src = Buffer.from(await body.arrayBuffer());
        context.drawImage(avatar, 25, 25, 200, 200);

        const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), { name: 'profile-image.png' });

        return interaction.editReply({files: [attachment], allowedMentions: {
            repliedUser: player.ping
        }})
    }
}

function applyText(canvas: Canvas.Canvas, text: string) {
    const context = canvas.getContext('2d');
    let fontSize = 55;

    do {
        context.font = `bold ${fontSize -= 10}px Noto Sans CJK JP`;
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

function invertColor(hex: string, bw: boolean = true) {

    if(hex.startsWith('#')) {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
    
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
    
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
    
        let r: string | number = parseInt(hex.slice(0, 2), 16),
            g: string | number = parseInt(hex.slice(2, 4), 16),
            b: string | number = parseInt(hex.slice(4, 6), 16);
    
        if (bw) {
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
    
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
    
        return "#" + r + g + b;
    } else {
        const rgb = hex.replace(/rgba?/gim, '').replace(/\(\)/gim, '').split(', ');
        let r: string | number = parseInt(rgb[0]),
            g: string | number = parseInt(rgb[1]),
            b: string | number = parseInt(rgb[2]);

        if (bw) {
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
    
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
    
        return "#" + r + g + b;
    }
}