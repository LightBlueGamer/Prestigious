import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BlackJack } from '../../lib/structures/BlackJack';
import { Player } from '../../lib/structures/Player';
import { cardBack } from '../../lib/misc/cards';

const inGame = new Set();

export default {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of blackjack.')
        .addIntegerOption(option => option.setName('bet').setDescription('The amount of money to bet.').setRequired(true).setMinValue(100))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        if(inGame.has(interaction.user.id)) return interaction.reply('You are already playing a game of blackjack.');
        await interaction.deferReply();
        const bet = interaction.options.getInteger('bet', true);
        const { user } = interaction;
        const player = await Player.get(user.id);
        if(Math.floor(bet) > player.coins) return interaction.editReply({
            content: `You don't have enough coins to bet ${Math.floor(bet)}!`,
            allowedMentions: {
                repliedUser: player.ping,
            },
        });

        const game = new BlackJack();
        game.shuffle();
        const { playerHand, houseHand } = game.deal();
        inGame.add(interaction.user.id);

        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('hit')
                    .setLabel('Hit')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('stand')
                    .setLabel('Stand')
                    .setStyle(ButtonStyle.Danger),
            );

        if(game.hasBlackJack(playerHand) && !game.hasBlackJack(houseHand)) {
            player.coins += Math.floor(bet * 1.5);
            player.addXp(2);
            player.save();
            inGame.delete(interaction.user.id);
            return interaction.editReply({
                content: `You got a blackjack! You win ${Math.floor(bet * 1.5)}!`,
                allowedMentions: {
                    repliedUser: player.ping,
                },
                embeds: [getEmbed()]
            });
        } else if(game.hasBlackJack(playerHand) && game.hasBlackJack(houseHand)) {
            interaction.editReply({
                content: `The dealer got ${game.getValue(houseHand)}! It's a draw!`,
                embeds: [getEmbed(true)]
            });
            return inGame.delete(interaction.user.id);
        } else {
            interaction.editReply({
                embeds: [getEmbed()],
                components: [buttons],
            });
            continueGame();
        };

        function getEmbed(showDealer = false) {
            const val = game.getValue(playerHand);
            return new EmbedBuilder()
            .setTitle(`Blackjack`)
            .addFields(
                {name: `Your hand (${game.getValue(playerHand)}):`, value: playerHand.map(card => card.icon).join(''), inline: true},
                {name: `Dealers hand (${showDealer ? game.getValue(houseHand) : houseHand[1].value})`, value: showDealer ? houseHand.map(card => card.icon).join('') : cardBack+houseHand[1].icon, inline: true},
            )
            .setColor(val < 17 ? '#0055ff' : val > 21 ? '#ff0000' : val === 21 ? '#00ff00' : '#ff9100')
        }

        function continueGame() {
            const collector = interaction.channel?.createMessageComponentCollector({
                filter: (i) => ['hit', 'stand'].includes(i.customId) && i.user.id === interaction.user.id,
                time: 1000 * 60 * 5,
                max: 1
            });

            collector?.on('collect', (i) => {
                if(i.customId === 'hit') {
                    game.hit(playerHand);
                    if(game.getValue(playerHand) > 21) {
                        i.update({
                            content: `You busted! You lose ${Math.floor(bet)}!`,
                            embeds: [getEmbed()],
                            components: [],
                        });
                        player.coins -= Math.floor(bet);
                        player.save();
                        inGame.delete(interaction.user.id);
                        return;
                    } else if(game.getValue(playerHand) === 21) {
                        i.update({
                            content: `You got blackjack! You win ${Math.floor(bet * 1.5)}!`,
                            embeds: [getEmbed()],
                            components: [],
                        });
                        player.coins += Math.floor(bet * 1.5);
                        player.addXp(2)
                        player.save();
                        inGame.delete(interaction.user.id);
                        return;
                    } else {
                        i.update({
                            content: `You hit!`,
                            embeds: [getEmbed()],
                            components: [buttons]
                        });
                        player.addXp(0.5);
                        player.save();
                        continueGame();
                    }
                } else if(i.customId === 'stand') {
                    i.update({
                        content: `You stand.`,
                        embeds: [getEmbed()],
                        components: [],
                    });
                    setTimeout(() => {
                        dealer();
                    }, 100);
                }
            });

            collector?.on('end', (_collected, reason) => {
                if(reason === 'time') {
                    interaction.editReply({
                        content: `You took too long to play!`,
                        embeds: [getEmbed()],
                        components: [],
                    });
                    inGame.delete(interaction.user.id);
                }
            });
        }

        function dealer() {

            interaction.editReply({
                content: `Dealers turn`,
                embeds: [getEmbed(true)],
                components: [],
            });
            while(game.getValue(houseHand) < 17) {
                game.hit(houseHand);
            }
            if(game.getValue(houseHand) > 21) {
                interaction.editReply({
                    content: `The dealer busted! You win ${Math.floor(bet)}!`,
                    embeds: [getEmbed(true)]
                });
                player.coins += Math.floor(bet);
                player.addXp();
                player.save();
                inGame.delete(interaction.user.id);
            } else if(game.getValue(houseHand) === 21) {
                interaction.editReply({
                    content: `The dealer got blackjack! You lose ${Math.floor(bet)}!`,
                    embeds: [getEmbed(true)]
                });
                player.coins -= Math.floor(bet);
                player.save();
                inGame.delete(interaction.user.id);
            } else if(game.getValue(houseHand) > game.getValue(playerHand)) {
                interaction.editReply({
                    content: `The dealer got ${game.getValue(houseHand)}! You lose ${Math.floor(bet)}!`,
                    embeds: [getEmbed(true)]
                });
                player.coins -= Math.floor(bet);
                player.save();
                inGame.delete(interaction.user.id);
            } else if(game.getValue(houseHand) < game.getValue(playerHand)) {
                interaction.editReply({
                    content: `The dealer got ${game.getValue(houseHand)}! You win ${Math.floor(bet)}!`,
                    embeds: [getEmbed(true)]
                });
                player.coins += Math.floor(bet);
                player.addXp();
                player.save();
                inGame.delete(interaction.user.id);
            } else if(game.getValue(houseHand) === game.getValue(playerHand)) {
                interaction.editReply({
                    content: `The dealer got ${game.getValue(houseHand)}! It's a draw!`,
                    embeds: [getEmbed(true)]
                });
                inGame.delete(interaction.user.id);
            };
        }

        return player.save();
    }
}