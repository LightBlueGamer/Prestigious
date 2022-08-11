import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, SlashCommandBuilder, type ChatInputCommandInteraction } from "discord.js";
import { HighLow } from "../../lib/structures/HighLow";
import { Player } from "../../lib/structures/Player";

export default {
    data: new SlashCommandBuilder()
        .setName('highlow')
        .setDescription('Play a game of highlow.')
        .addIntegerOption(option => option.setName('bet').setDescription('The amount of money to bet.').setRequired(true).setMinValue(100))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
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
        player.coins -= Math.floor(bet);

        const game = new HighLow();
        game.shuffle();

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

        update();
        continueGame();

        function update() {
            interaction.editReply({
                content: `Higher or lower?\n${currentCard.icon}`,
                allowedMentions: {
                    repliedUser: player.ping,
                },
                components: [buttons],
            });
        }

        function continueGame() {
            if(game.deck.length === 0) {
                let gained = 0;
                        if(correct > 5) {
                            gained = bet * (correct / 10)
                            player.coins += Math.floor(bet * (correct / 10))
                        }
                const coins = player.addCoins(1 + correct / 10);
                player.addXp(1 + correct / 10);
                player.save();

                interaction.editReply({
                    content: `You got ${correct} correct! You got ${coins+gained} coins!`,
                    allowedMentions: {
                        repliedUser: player.ping,
                    },
                    components: [],
                });
            }
                
            const collector = interaction.channel?.createMessageComponentCollector({
                filter: (i) => ['higher', 'lower'].includes(i.customId) && i.user.id === interaction.user.id,
                time: 20000,
                max: 1,
            });

            collector?.on('collect', async (i: ButtonInteraction) => {
                if(i.customId === 'higher') {
                    const nextCard = game.nextCard();
                    if(nextCard.value >= currentCard.value) {
                        correct++;
                        currentCard = nextCard;
                        i.update({
                            content: `Correct!\nHigher or lower?\n${currentCard.icon}`,
                            allowedMentions: {
                                repliedUser: player.ping,
                            },
                            components: [buttons],
                        })
                        continueGame();
                    } else {
                        let gained = 0;
                        if(correct > 5) {
                            gained = bet * (correct / 10)
                            player.coins += Math.floor(bet * (correct / 10))
                        } else player.coins -= Math.floor(bet);
                        const coins = player.addCoins(1 + (correct / 10));
                        player.addXp(1 + (correct / 5));
                        player.save();

                        i.update({
                            content: `You lost and got ${correct} correct. You got a total of ${coins+gained} coins.\n${nextCard.icon}`,
                            allowedMentions: {
                                repliedUser: player.ping,
                            },
                            components: [],
                        });

                    }
                } else if(i.customId === 'lower') {
                    const nextCard = game.nextCard();
                    if(nextCard.value <= currentCard.value) {
                        correct++;
                        currentCard = nextCard;
                        i.update({
                            content: `Correct!\nHigher or lower?\n${currentCard.icon}`,
                            allowedMentions: {
                                repliedUser: player.ping,
                            },
                            components: [buttons],
                        })
                        continueGame();
                    } else {
                        let gained = 0;
                        if(correct > 5) {
                            gained = bet * (correct / 10)
                            player.coins += Math.floor(bet * (correct / 10))
                        }  else player.coins -= Math.floor(bet);
                        const coins = player.addCoins(1 + (correct / 10));
                        player.addXp(1 + (correct / 5));
                        player.save();

                        i.update({
                            content: `You lost and got ${correct} correct. You got a total of ${coins+gained} coins.\n${nextCard.icon}`,
                            allowedMentions: {
                                repliedUser: player.ping,
                            },
                            components: [],
                        });
                    }
                }
            });
        }
        return;
    }
}