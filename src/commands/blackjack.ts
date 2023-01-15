import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Deck } from '../lib/classes/Deck.js';
import { Player } from '../lib/classes/Player.js';
import { Poker } from '../lib/classes/Poker.js';
import { cardBack } from '../lib/misc/cards.js';
const inGame = new Set();
export default {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Play a deck of blackjack.")
        .addIntegerOption(option => option.setName('bet').setDescription('The amount of money to bet.').setRequired(true).setMinValue(500))
        .setDMPermission(false),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { user, client } = interaction;
        if (inGame.has(user.id)) return interaction.editReply({ content: 'You are already playing a game of blackjack.' });
        const bet = interaction.options.getInteger('bet', true);
        inGame.add(user.id);
        let deck = Deck.init(3);
        const p = await Player.get(user.id, client);
        if (Math.floor(bet) > p.balance) return interaction.editReply({
            content: `You don't have enough money to bet ${Math.floor(bet)}!`,
        });
        const player: Deck.Hand = [];
        const house: Deck.Hand = [];
        for (let i = 0; i < 2; i++) {
            player.push(deck.blackJackNextCard(player));
            house.push(deck.blackJackNextCard(house));
        };

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

        if (deck.hasBlackJack(player) && !deck.hasBlackJack(house)) {
            p.addMoney(Math.floor(bet * 1.5))
                .save();
            inGame.delete(user.id);
            return interaction.editReply({
                content: `You got a blackjack! You win $${Math.floor(bet * 1.5)}!`,
                embeds: [getEmbed()]
            });
        } else if (deck.hasBlackJack(player) && deck.hasBlackJack(house)) {
            interaction.editReply({
                content: `The dealer got ${deck.getValue(house)}! It's a draw!`,
                embeds: [getEmbed(true)]
            });
            return inGame.delete(user.id);
        } else {
            interaction.editReply({
                embeds: [getEmbed()],
                components: [buttons],
            });
            continueGame();
        };

        function getEmbed(showDealer = false) {
            const val = deck.getValue(player);
            return new EmbedBuilder()
                .setTitle(`Blackjack`)
                .addFields(
                    { name: `Your hand (${deck.getValue(player)}):`, value: `\`${player.map(card => card.icon).join('')}\``, inline: true },
                    { name: `Dealers hand (${showDealer ? deck.getValue(house) : house[1].value})`, value: showDealer ? `\`${house.map(card => card.icon).join('')}\`` : `\`${cardBack + house[1].icon}\``, inline: true },
                )
                .setColor(val < 17 ? '#0055ff' : val > 21 ? '#ff0000' : val === 21 ? '#00ff00' : '#ff9100')
        }

        function continueGame() {
            const collector = interaction.channel?.createMessageComponentCollector({
                filter: (i) => ['hit', 'stand'].includes(i.customId) && i.user.id === user.id,
                time: 1000 * 60 * 5,
                max: 1
            });

            collector?.on('collect', (i) => {
                if (i.customId === 'hit') {
                    deck.hit(player);
                    if (deck.getValue(player) >= 22) {
                        i.update({
                            content: `You busted! You lose $${Math.floor(bet)}!`,
                            embeds: [getEmbed()],
                            components: [],
                        });
                        p.removeMoney(Math.floor(bet))
                            .save();
                        inGame.delete(user.id);
                        return;
                    } else if (deck.getValue(player) === 21) {
                        i.update({
                            content: `You got blackjack! You win $${Math.floor(bet * 1.5)}!`,
                            embeds: [getEmbed()],
                            components: [],
                        });
                        p.addMoney(Math.floor(bet * 1.5))
                            .save();
                        inGame.delete(user.id);
                        return;
                    } else {
                        i.update({
                            content: `You hit!`,
                            embeds: [getEmbed()],
                            components: [buttons]
                        });
                        continueGame();
                    }
                } else if (i.customId === 'stand') {
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
                if (reason === 'time') {
                    interaction.editReply({
                        content: `You took too long to play!`,
                        embeds: [getEmbed()],
                        components: [],
                    });
                    inGame.delete(interaction.user.id);
                }
            });
        };

        function dealer() {

            interaction.editReply({
                content: `Dealers turn`,
                embeds: [getEmbed(true)],
                components: [],
            });

            houseHit();

            if (deck.getValue(house) > 21) {
                interaction.editReply({
                    content: `The dealer busted! You win $${Math.floor(bet * 1.2)}!`,
                    embeds: [getEmbed(true)]
                });
                p.addMoney(Math.floor(bet * 1.2))
                    .save();
                inGame.delete(user.id);
            } else if (deck.getValue(house) === 21) {
                interaction.editReply({
                    content: `The dealer got blackjack! You lose $${Math.floor(bet)}!`,
                    embeds: [getEmbed(true)]
                });
                p.removeMoney(Math.floor(bet))
                    .save();
                inGame.delete(interaction.user.id);
            } else if (deck.getValue(house) > deck.getValue(player)) {
                interaction.editReply({
                    content: `The dealer got ${deck.getValue(house)}! You lose $${Math.floor(bet)}!`,
                    embeds: [getEmbed(true)]
                });
                p.removeMoney(Math.floor(bet))
                    .save();
                inGame.delete(user.id);
            } else if (deck.getValue(house) < deck.getValue(player)) {
                interaction.editReply({
                    content: `The dealer got ${deck.getValue(house)}! You win $${Math.floor(bet * 1.2)}!`,
                    embeds: [getEmbed(true)]
                });
                p.addMoney(Math.floor(bet))
                    .save();
                inGame.delete(user.id);
            } else if (deck.getValue(house) === deck.getValue(player)) {
                interaction.editReply({
                    content: `The dealer got ${deck.getValue(house)}! It's a draw!`,
                    embeds: [getEmbed(true)]
                });
                inGame.delete(interaction.user.id);
            };
        };

        function houseHit() {
            setTimeout(() => {
                deck.hit(house);
                interaction.editReply({
                    content: `The dealer busted! You win $${Math.floor(bet * 1.2)}!`,
                    embeds: [getEmbed(true)]
                });
                if (deck.getValue(house) < 17) houseHit();
            }, 1000);
        };

        return p.save();
    },
};