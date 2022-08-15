import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { HighLow } from "../../lib/structures/HighLow";
import { Player } from "../../lib/structures/Player";

const inGame = new Set();

export default {
    data: new SlashCommandBuilder()
        .setName('highlow')
        .setDescription('Play a game of highlow.')
        .addIntegerOption(option => option.setName('bet').setDescription('The amount of money to bet.').setRequired(true).setMinValue(100))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        if(inGame.has(interaction.user.id)) return interaction.reply('You are already playing a game of highlow.');
        await interaction.deferReply();
        const bet = Math.floor(interaction.options.getInteger('bet', true));
        const { user } = interaction;
        const player = await Player.get(user.id);
        if(Math.floor(bet) > player.coins) return interaction.editReply({
            content: `You don't have enough coins to bet ${Math.floor(bet)}!`,
            allowedMentions: {
                repliedUser: player.ping,
            },
        });

        const game = new HighLow();
        game.shuffle();
        inGame.add(interaction.user.id);

        const buttons = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('higher')
                    .setLabel('Higher')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('lower')
                    .setLabel('Lower')
                    .setStyle(ButtonStyle.Danger),
            );

        let currentCard = game.nextCard();
        let correct = 0;
        let gained = 0;
        player.coins -= Math.floor(bet);
        player.save();

        update();
        continueGame();

        function update() {
            interaction.editReply({
                content: `Higher or lower? Card ${correct+1}/${game.deck.length+correct+1}\n${currentCard.icon}`,
                allowedMentions: {
                    repliedUser: player.ping,
                },
                components: [buttons],
            });
        }

        async function continueGame() {
            const nextCard = game.nextCard();
            if(game.deck.length === 0) {
                    if(correct > 5) {
                        gained = bet * (correct / 25)
                        player.coins += Math.floor(bet * (correct / 25))
                        player.save();
                    }
                const coins = await player.addCoins(1 + correct / 20);
                player.addXp(1 + correct / 10);
                player.save();
                inGame.delete(interaction.user.id);

                return interaction.editReply({
                    content: `You got ${correct} correct! ${gained+coins > bet ? `You got ${Math.floor(gained+coins)} coins!` : `You lost ${bet-gained} coins!`}`,
                    allowedMentions: {
                        repliedUser: player.ping,
                    },
                    components: [],
                });
            }
                
            const collector = interaction.channel?.createMessageComponentCollector({
                filter: (i) => ['higher', 'lower'].includes(i.customId) && i.user.id === interaction.user.id,
                time: 1000 * 60 * 5,
                max: 1,
            });

            collector?.on('collect', async (i: ButtonInteraction) => {
                if(i.customId === 'higher') {
                    if(nextCard.value >= currentCard.value) {
                        correct++;
                        currentCard = nextCard;
                        i.update({
                            content: `Correct! Card ${correct+1}/${game.deck.length+correct+1}\nHigher or lower?\n${currentCard.icon}`,
                            allowedMentions: {
                                repliedUser: player.ping,
                            },
                            components: [buttons],
                        })
                        continueGame();
                    } else {
                        if(correct >= 5) {
                            gained = bet * (correct / 25)
                            player.coins += Math.floor(bet * (correct / 25))
                            player.save()
                        }
                        const coins = await player.addCoins(1 + (correct / 20));
                        player.addXp(1 + (correct / 5));
                        player.save();
                        inGame.delete(interaction.user.id);

                        i.update({
                            content: `You lost and got ${correct} correct. ${gained+coins > bet ? `You got ${gained} coins!` : `You lost ${bet-gained} coins!`}\n${nextCard.icon}`,
                            allowedMentions: {
                                repliedUser: player.ping,
                            },
                            components: [],
                        });

                    }
                } else if(i.customId === 'lower') {
                    if(nextCard.value <= currentCard.value) {
                        correct++;
                        currentCard = nextCard;
                        i.update({
                            content: `Correct! Card ${correct+1}/${game.deck.length+correct+1}\nHigher or lower?\n${currentCard.icon}`,
                            allowedMentions: {
                                repliedUser: player.ping,
                            },
                            components: [buttons],
                        })
                        continueGame();
                    } else {
                        if(correct >= 5) {
                            gained = bet * (correct / 26)
                            player.coins += Math.floor(bet * (correct / 25))
                            player.save();
                        }
                        const coins = await player.addCoins(1 + (correct / 20));
                        player.addXp(1 + (correct / 5));
                        player.save();
                        inGame.delete(interaction.user.id);

                        i.update({
                            content: `You lost and got ${correct} correct. ${gained+coins > bet ? `You got ${Math.floor(gained+coins)} coins!` : `You lost ${Math.floor(bet-(gained+coins))} coins!`}\n${nextCard.icon}`,
                            allowedMentions: {
                                repliedUser: player.ping,
                            },
                            components: [],
                        });
                    }
                }
            });

            collector?.on('end', (_collected, reason) => {
                if(reason === 'time') {
                    interaction.editReply({
                        content: `You took too long to play!`,
                        components: [],
                    });
                    inGame.delete(interaction.user.id);
                }
            });

            return;
        }

        return;
    }
}