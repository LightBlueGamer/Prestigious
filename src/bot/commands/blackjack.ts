import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { BlackJack } from '../../lib/structures/BlackJack';
import { Player } from '../../lib/structures/Player';
import { cardBack } from '../../lib/misc/cards';

export default {
    data: new SlashCommandBuilder()
        .setName('blackjack')
        .setDescription('Play a game of blackjack.')
        .addIntegerOption(option => option.setName('bet').setDescription('The amount of money to bet.').setRequired(true).setMinValue(1))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
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
        if(game.hasBlackJack(playerHand) && !game.hasBlackJack(houseHand)) {
            player.coins += Math.floor(bet * 1.5);
            player.save();
            return interaction.editReply({
                content: `You got a blackjack! You won ${Math.floor(bet * 1.5)} coins!`,
                allowedMentions: {
                    repliedUser: player.ping,
                },
                embeds: [getEmbed()]
            });
        }

        let hideFirst = true;

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
        updateEmbed();
        continueGame();

        function getEmbed() {
            return new EmbedBuilder()
                .setTitle('Blackjack')
                .addFields(
                    { name: `Your hand (${game.getValue(playerHand)})`, value: `${playerHand.map(card => card.icon).join('')}`, inline: true },
                    { name: '\u200b', value: '\u200b', inline: true },
                    { name: `Dealers hand (${hideFirst ? houseHand[1].value : game.getValue(houseHand)})`, value: hideFirst ? `${cardBack}${houseHand[1].icon}` : `${houseHand.map(card => card.icon).join('')}`, inline: true },
                )
                .setFooter({ text: `Your bet: ${Math.floor(bet)}` });
        };

        function updateEmbed() {
            return interaction.editReply({
                embeds: [getEmbed()],
                components: [buttons],
                allowedMentions: {
                    repliedUser: player.ping,
                },
            });
        }

        function continueGame() {
            const collector = interaction.channel?.createMessageComponentCollector({
                filter: (i) => ['hit', 'stand'].includes(i.customId) && i.user.id === interaction.user.id,
                time: 15000,
                max: 1,
            });

            collector?.on('collect', async (i: ButtonInteraction) => {
                if(i.customId === 'hit') {
                    game.hit(playerHand);
                    i.update({
                        content: 'You hit!',
                        embeds: [getEmbed()],
                        components: [buttons],
                        allowedMentions: {
                            repliedUser: player.ping,
                        },
                    });
                    setTimeout(() => {
                        if(game.hasBust(playerHand)) {
                            bust();
                            interaction.editReply({
                                content: `You busted! You lost ${Math.floor(bet)} coins!`,
                                embeds: [getEmbed()],
                                allowedMentions: {
                                    repliedUser: player.ping,
                                },
                                components: []
                            });
                        }
                        if(game.hasBlackJack(playerHand)) {
                            blackjack();
                            interaction.editReply({
                                content: `You got a blackjack! You won ${Math.floor(bet * 1.5)} coins!`,
                                embeds: [getEmbed()],
                                allowedMentions: {
                                    repliedUser: player.ping,
                                },
                                components: []
                            });
                        }
                        else continueGame();
                    }, 100);
                } else if(i.customId === 'stand') {
                    i.update({
                        embeds: [getEmbed()],
                        components: [buttons],
                        allowedMentions: {
                            repliedUser: player.ping,
                        },
                    });
                    setTimeout(() => dealerTurn(), 100);
                }
            });
        };

        function bust() {
            player.coins -= Math.floor(bet);
            player.save();
        }

        function blackjack() {
            player.coins += Math.floor(bet * 1.5);
            player.save();
        }

        function dealerTurn() {
            hideFirst = false;
            updateEmbed();
            if(game.getValue(houseHand) < 17) {
                game.hit(houseHand);
                interaction.editReply({
                    content: 'The dealer hit!',
                    embeds: [getEmbed()],
                    components: [],
                    allowedMentions: {
                        repliedUser: player.ping,
                    },
                });
                if(game.hasBust(houseHand)) {
                    player.coins += Math.floor(bet);
                    player.save();
                    return interaction.editReply({
                        content: `The dealer busted! You won ${Math.floor(bet)} coins!`,
                        allowedMentions: {
                            repliedUser: player.ping,
                        },
                        components: []
                    });
                } else if(game.hasBlackJack(houseHand)) {
                    player.coins -= Math.floor(bet);
                    player.save();
                    return interaction.editReply({
                        content: `The dealer got a blackjack! You lost ${Math.floor(bet)} coins!`,
                        allowedMentions: {
                            repliedUser: player.ping,
                        },
                        components: []
                    });
                } else setTimeout(() => dealerTurn(), 1500);
            } else {
                if(game.getValue(houseHand) > game.getValue(playerHand)) {
                    player.coins -= Math.floor(bet);
                    player.save();
                    return interaction.editReply({
                        content: `The dealer beat you! You lost ${Math.floor(bet)} coins!`,
                        allowedMentions: {
                            repliedUser: player.ping,
                        },
                        components: []
                    });
                } else if(game.getValue(houseHand) < game.getValue(playerHand)) {
                    player.coins += bet;
                    player.save();
                    return interaction.editReply({
                        content: `You beat the dealer! You won ${Math.floor(bet)} coins!`,
                        allowedMentions: {
                            repliedUser: player.ping,
                        },
                        components: []
                    });
                } else return;
            }
            return;
        }
        return;
    }
}