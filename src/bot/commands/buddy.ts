import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { Player } from '../../lib/structures/Player';
import { Creature } from '../../lib/structures/Creature';
import { Buddy } from '../../lib/structures/Buddy';

export default {
    data: new SlashCommandBuilder()
        .setName('buddy')
        .setDescription('Base command for buddys.')
        .setDMPermission(false)
        .addSubcommand(subcommand => 
            subcommand
                .setName('set')
                .setDescription('Set a creature in your inventory as your new buddy')
                .addStringOption(option => 
                    option
                        .setName('creature')
                        .setDescription('The creature to set as your buddy.')
                        .setAutocomplete(true)
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('show')
                .setDescription('Show your current or all buddies.')
                .addStringOption(option =>
                    option
                        .setName('option')
                        .setDescription('What to show.')
                        .addChoices(
                            { name: 'Current', value: 'current' },
                            { name: 'All', value: 'all' }
                        )
                )
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const subCommand = interaction.options.getSubcommand();
        const player = await Player.get(interaction.user.id);

        switch (subCommand) {
            case 'set': {
                const creature = await Creature.find(interaction.options.getString('creature', true));
                if (player.inventory.some(x => x.name.toLowerCase() === creature.name.toLowerCase())) {
                    const buddy = new Buddy(creature.name, creature.health, creature.health, creature.stamina, creature.stamina);
                    if (!player.hasBuddy()) {
                        player.buddy = buddy;
                        const item = player.getItem(creature.name);
                        player.removeItem(item!, 1)
                        await player.save();
                        interaction.editReply({
                            content: `You have set ${creature.name} as your buddy!`,
                            allowedMentions: {
                                repliedUser: player.ping,
                            },
                        });
                    } else {
                        const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('yes')
                                .setLabel('Yes')
                                .setStyle(ButtonStyle.Success),
                            new ButtonBuilder()
                                .setCustomId('no')
                                .setLabel('No')
                                .setStyle(ButtonStyle.Danger),
                        );
                        await interaction.editReply({
                            content: `You already have a buddy, do you want to replace it with ${creature.name}?`,
                            allowedMentions: {
                                repliedUser: player.ping
                            },
                            components: [row],
                        });
        
                        const collector = interaction.channel?.createMessageComponentCollector({
                            filter: (i) => ['yes', 'no'].includes(i.customId) && i.user.id === interaction.user.id,
                            time: 15000,
                            max: 1,
                        });

                        collector?.on('collect', async (i) => {
                            if (i.customId === 'yes') {
                                player.buddys.push(player.buddy);
                                player.buddy = buddy;
                                const item = player.getItem(creature.name);
                                player.removeItem(item!, 1)
                                await player.save();
                                await i.update({
                                    content: `Your buddy has been set to ${creature.name}!`,
                                    components: [],
                                });
                            } else {
                                await i.update({
                                    content: 'Cancelled!',
                                    components: [],
                                });
                            }
                        });
                        collector?.on('end', async (_c, reason) => {
                            if (reason === 'time') {
                                await interaction.editReply({
                                    content: 'You took too long to respond.',
                                    allowedMentions: {
                                        repliedUser: player.ping
                                    },
                                    components: [],
                                });
                            }
                        });
                    }
                }
            }
                
            break;

            case 'show': {
                const option = interaction.options.getString('option');
                if (option === 'current') {
                    if (!player.hasBuddy()) {
                        await interaction.editReply({
                            content: 'You don\'t have a buddy.',
                            allowedMentions: {
                                repliedUser: player.ping
                            },
                        });
                    } else {
                        const embed = new EmbedBuilder()
                            .setTitle(`${player.buddy.name}`)
                            .setDescription(`Health: ${player.buddy.health}/${player.buddy.maxHealth}\nStamina: ${player.buddy.stamina}/${player.buddy.maxStamina}\nLevel: ${player.buddy.level}\nXP: ${player.buddy.xp}/${player.buddy.requiredXp()}`)
                            .setColor('Random');
                        await interaction.editReply({
                            embeds: [embed],
                            allowedMentions: {
                                repliedUser: player.ping
                            },
                        });
                    }
                } else {
                    if (player.buddys.length === 0) {
                        await interaction.editReply({
                            content: 'You don\'t have any buddies in your buddy pack.',
                            allowedMentions: {
                                repliedUser: player.ping
                            },
                        });
                    } else {
                        const embed = new EmbedBuilder()
                            .setTitle('Your Buddys')
                            .setDescription(player.buddys.sort((a, b) => b.level! - a.level!).map(x => `${x.name} - Level: ${x.level}`).join('\n'))
                            .setColor('Random');
                        await interaction.editReply({
                            embeds: [embed],
                            allowedMentions: {
                                repliedUser: player.ping
                            },
                        });
                    }
                }
            }

            break;
        
            default:
                break;
        }
    },
};
