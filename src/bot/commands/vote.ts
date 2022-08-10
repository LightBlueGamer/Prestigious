import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export default {
    devCmd: false,
    permLevel: 0,
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Vote for the bot on TopGG')
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction?.channel?.send({
            content: `You can vote for the bot on TopGG here: <https://top.gg/bot/994973502975262980/vote>\nYou can also vote for the support server here: <https://top.gg/servers/891924180721893376?s=0ac0bceade0de>\nBoth of these votes gives you a lootbox.`,
        })
    },
};
