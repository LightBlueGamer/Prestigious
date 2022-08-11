import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { Clan, ClanRanks } from "../../lib/structures/Clan";
import { Player } from "../../lib/structures/Player";

export default {
    data: new SlashCommandBuilder()
        .setName('clan')
        .setDescription('Check clan stats, create a new clan or edit an existing one!')
        .setDMPermission(false)
        .addSubcommand(subcommand => 
            subcommand
                .setName('create')
                .setDescription('Create a new clan, costs 10000 coins.')
                .addStringOption(option => 
                    option
                        .setName('name')
                        .setDescription('The name of the clan.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('invite')
                .setDescription('Invite a user to your clan.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to invite.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('uninvite')
                .setDescription('Uninvite a user to your clan.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to uninvite.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('kick')
                .setDescription('Kick a user from your clan.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to kick.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('leave')
                .setDescription('Leave your clan.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('deposit')
                .setDescription('Deposit money into your clan.')
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of money to deposit.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('withdraw')
                .setDescription('Withdraw money from your clan.')
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of money to withdraw.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('addxp')
                .setDescription('Add xp to your clan.')
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount of xp to add.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('stats')
                .setDescription('Increase your clan stats.')
                .addStringOption(option =>
                    option
                        .setName('stat')
                        .setDescription('The stat to increase.')
                        .addChoices(
                            { name: 'xpboost', value: 'xp' },
                            { name: 'coinboost', value: 'coin' }
                        )
                .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName('amount')
                        .setDescription('The amount to increase the stat by.')
                        .setRequired(false)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('promote')
                .setDescription('Promote a user to a the next rank.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to promote.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('demote')
                .setDescription('Demote a user to a the previous rank.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to demote.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('setleader')
                .setDescription('Set a user as the clan leader.')
                .addUserOption(option =>
                    option
                        .setName('user')
                        .setDescription('The user to set as the clan leader.')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Search for a clan.')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the clan to search for.')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('join')
                .setDescription('Join a clan.')
                .addStringOption(option =>
                    option
                        .setName('name')
                        .setDescription('The name of the clan to join.')
                        .setRequired(true)
                        .setAutocomplete(true)
                )
        )
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const subCommand = interaction.options.getSubcommand();
        const player = await Player.get(interaction.user.id);

        switch (subCommand) {
            case 'create': {
                const name = interaction.options.getString('name')!;
                if (player.coins < 10000) return interaction.editReply({
                    content: 'You do not have enough coins to create a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const inClan = await Clan.getFromUser(interaction.user.id);
                if(inClan) return interaction.editReply({
                    content: 'You are already in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ok')
                            .setLabel('Yes')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('no')
                            .setLabel('No')
                            .setStyle(ButtonStyle.Danger),
                    );
                await interaction.editReply({
                    content: `Are you sure you want to create the clan ${name} for 10000 coins?`,
                    allowedMentions: {
                        repliedUser: player.ping
                    },
                    components: [row],
                });

                const collector = interaction.channel?.createMessageComponentCollector({
                    filter: (i) => ['ok', 'no'].includes(i.customId) && i.user.id === interaction.user.id,
                    time: 15000,
                    max: 1,
                });

                collector?.on('collect', async (i) => {
                    if(i.customId === 'ok') {
                        const clanExists = await Clan.getClan(name);
                        if(clanExists) {
                            interaction.editReply({
                                content: 'The clan already exists.',
                            });
                        } else {
                            player.coins -= 10000;
                            player.save();
                            const clan = await Clan.get(name, interaction.user.id);
                            interaction.editReply({
                                content: `The clan ${clan.name} has been created.`,
                                allowedMentions: {
                                    repliedUser: player.ping
                                }
                            });
                            clan.save();
                        }
                    } else {
                        interaction.editReply({
                            content: 'The clan was not created.',
                            allowedMentions: {
                                repliedUser: player.ping
                            }
                        });
                    }
                })

                collector?.on('end', collected => console.log(`Collected ${collected.size} items`));
            }
            
            break;

            case 'invite': {
                const user = interaction.options.getUser('user')!;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                if(!executor) throw new Error('You are not in the clan.');
                const invite = userClan.addInvite(user.id, executor);
                userClan.save();
                if(!invite) return interaction.editReply({
                    content: 'The user is already in the clan or you arent high enough rank to invite people.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                interaction.editReply({
                    content: `${user.username} has been invited to your clan.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                interaction.channel?.send({
                    content: `<@${user.id}> you have been invited to the clan ${userClan.name} by ${interaction.user.username}.`,
                    allowedMentions: {
                        users: [user.id]
                    }
                })
            }
        
            break;
        
            case 'uninvite': {
                const user = interaction.options.getUser('user')!;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                if(!executor) return;
                const invite = userClan.removeInvite(user.id, executor);
                userClan.save();
                if(!invite) return interaction.editReply({
                    content: 'The user is not invited to the clan or you arent high enough rank to remove invites.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                interaction.editReply({
                    content: `${user.username}'s invite has been removed from your clan.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }
                
            break;

            case 'kick': {
                const user = interaction.options.getUser('user')!;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                const member = userClan.getMember(user.id);
                if(!executor) return;
                if(!member) return 
                const removed = userClan.removeMember(member, executor);
                userClan.save();
                if(!removed) return interaction.editReply({
                    content: 'The user is not in the clan or you arent high enough rank to kick people.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                interaction.editReply({
                    content: `${user.username} has been kicked from your clan.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }
                
            break;

            case 'leave': {
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                if(!executor) return;
                if(executor.rank === ClanRanks.Leader) {
                    const row = new ActionRowBuilder<ButtonBuilder>()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('ok')
                                .setLabel('Yes')
                                .setStyle(ButtonStyle.Primary),
                            new ButtonBuilder()
                                .setCustomId('no')
                                .setLabel('No')
                                .setStyle(ButtonStyle.Danger),
                        );
                    await interaction.editReply({
                        content: `Are you sure you want to leave your clan? This will make the 2nd highest ranked member the leader.`,
                        allowedMentions: {
                            repliedUser: player.ping
                        },
                        components: [row],
                    });
                
                    const collector = interaction.channel?.createMessageComponentCollector({
                        filter: (i) => ['ok', 'no'].includes(i.customId) && i.user.id === interaction.user.id,
                        time: 15000,
                        max: 1,
                    });
    
                    collector?.on('collect', async (i) => {
                        if(i.customId === 'ok') {
                            await i.update({
                                content: `You left your clan.`,
                                allowedMentions: {
                                    repliedUser: player.ping
                                },
                                components: [],
                            });
                            const leave = await userClan.leave(executor);
                            if(leave) userClan.save();
                        } else {
                            await i.update({
                                content: `You cancelled leaving the clan.`,
                                allowedMentions: {
                                    repliedUser: player.ping
                                },
                                components: [],
                            })
                            return;
                        }
                    });
    
                    collector?.on('end', collected => console.log(`Collected ${collected.size} items`));
                } else {
                    const leave = await userClan.leave(executor);
                    if(leave) userClan.save();
                    interaction.editReply({
                        content: `You have left your clan.`,
                        allowedMentions: {
                            repliedUser: player.ping
                        }
                    });
                }
            }
                
            break;

            case 'deposit': {
                const amount = interaction.options.getInteger('amount')!;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                if(!executor) return;
                const deposit = await userClan.deposit(executor, amount);
                userClan.save();
                if(!deposit) return interaction.editReply({
                    content: 'The clans vault is full or you don\'t have enough money to deposit.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                interaction.editReply({
                    content: `You have deposited ${amount} coins into your clan.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }
                
            break;

            case 'withdraw': {
                const amount = interaction.options.getInteger('amount')!;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                if(!executor) return;
                const withdraw = await userClan.withdraw(executor, amount);
                userClan.save();
                if(!withdraw) return interaction.editReply({
                    content: 'There is not enough money in the clans vault to withdraw.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                interaction.editReply({
                    content: `You have withdrawn ${amount} coins from your clan.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }
                
            break;

            case 'addxp': {
                const amount = interaction.options.getInteger('amount')!;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                if(!executor) return;
                const xp = await userClan.addXp(executor, amount);
                userClan.save();
                if(!xp) return interaction.editReply({
                    content: `You don't have enough xp to add ${amount} xp.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                interaction.editReply({
                    content: `You have added ${amount} xp to your clan.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }
                
            break;

            case 'stats': {
                const stat = interaction.options.getString('stat')!;
                const amount = interaction.options.getInteger('amount') || 1;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                if(userClan.statPoints < amount) return interaction.editReply({
                    content: `Your clan don't have enough stat points to add ${amount} points.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                if(stat === 'xp') {
                    userClan.increaseXpBoost(amount);
                } else if(stat === 'coin') {
                    userClan.increaseCoinBoost(amount);
                }
                userClan.save();
                interaction.editReply({
                    content: `You have increased your clans ${stat} boost by ${amount}.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }
                
            break;

            case 'promote': {
                const user = interaction.options.getUser('user')!;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                const member = userClan.getMember(user.id);
                if(!executor) return;
                if(!member) return;
                const promote = userClan.promoteMember(member, executor);
                userClan.save();
                if(!promote) return interaction.editReply({
                    content: 'You can\'t promote this member because your not high enough rank.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                interaction.editReply({
                    content: `${user.username} has been promoted to ${member.rank} in your clan.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }
                
            break;

            case 'demote': {
                const user = interaction.options.getUser('user')!;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                const member = userClan.getMember(user.id);
                if(!executor) return;
                if(!member) return;
                const demote = userClan.demoteMember(member, executor);
                userClan.save();
                if(!demote) return interaction.editReply({
                    content: 'You can\'t demote this member because your not high enough rank.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                interaction.editReply({
                    content: `${user.username} has been demoted to ${member.rank} in your clan.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }
                
            break;

            case 'setleader': {
                const user = interaction.options.getUser('user')!;
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(!userClan) return interaction.editReply({
                    content: 'You are not in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const executor = userClan.getMember(interaction.user.id);
                if(!executor) return;
                if(executor.rank !== ClanRanks.Leader) return interaction.editReply({
                    content: 'You can\'t set the leader of a clan unless you are the leader.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const member = userClan.getMember(user.id);
                if(!member) return;
                const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('ok')
                            .setLabel('Yes')
                            .setStyle(ButtonStyle.Primary),
                        new ButtonBuilder()
                            .setCustomId('no')
                            .setLabel('No')
                            .setStyle(ButtonStyle.Danger),
                    );
                await interaction.editReply({
                    content: `Are you sure you want to set ${user.username} as the leader of your clan?`,
                    allowedMentions: {
                        repliedUser: player.ping
                    },
                    components: [row],
                });

                const collector = interaction.channel?.createMessageComponentCollector({
                    filter: (i) => ['ok', 'no'].includes(i.customId) && i.user.id === interaction.user.id,
                    time: 15000,
                    max: 1,
                });

                collector?.on('collect', async (i) => {
                    if(i.customId === 'ok') {
                        await i.update({
                            content: `${user.username} is now the leader of your clan.`,
                            allowedMentions: {
                                repliedUser: player.ping
                            },
                            components: [],
                        })
                        userClan.setLeader(member, executor);
                        userClan.save();
                    } else {
                        await i.update({
                            content: `You have cancelled the leader change.`,
                            allowedMentions: {
                                repliedUser: player.ping
                            },
                            components: [],
                        })
                        return;
                    }
                });

                collector?.on('end', collected => console.log(`Collected ${collected.size} items`));
            }
                
            break;

            case 'search': {
                const name = interaction.options.getString('name', true);
                const clan = await Clan.getClan(name);
                if(!clan) return interaction.editReply({
                    content: `No clan found with the name ${name}.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const members = await Promise.all(clan.getMembersRankSorted.map(async (m) => {
                    const player = await Player.get(m.id);
                    return `${ClanRanks[m.rank]} - ${player.getName()}: ${m.totalContribution.xp} xp ${m.totalContribution.coins} coins contributed.`;
                }))
                const embed = new EmbedBuilder()
                    .setTitle(`${clan.name} - Lvl ${clan.level}`)
                    .setDescription(`Members:\n\`\`\`${members.join('\n')}\`\`\``)
                    .addFields(
                        {name: `XP Boost`, value: `${clan.stats.xpMultiplier}x`, inline: true},
                        {name: '\u200b', value: '\u200b', inline: true},
                        {name: `Coin Boost`, value: `${clan.stats.coinMultiplier}x`, inline: true},
                        {name: `Vault`, value: `${clan.vault}/${clan.maxVaulted} coins`, inline: true},
                        {name: `Experience`, value: `${clan.exp}/${clan.xpRequired}`, inline: true},
                        {name: `Stat Points`, value: `${clan.statPoints}`, inline: true},
                    )
                interaction.editReply({
                    embeds: [embed],
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }

            break;

            case 'join': {
                const userClan = await Clan.getFromUser(interaction.user.id);
                if(userClan) return interaction.editReply({
                    content: 'You are already in a clan.',
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const name = interaction.options.getString('name', true);
                const clan = await Clan.getClan(name);
                if(!clan) return interaction.editReply({
                    content: `No clan found with the name ${name}.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                clan.addMember(interaction.user.id);
                clan.save();

                interaction.editReply({
                    content: `You have joined the clan ${clan.name}.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }

            break;
            
            default: {
                const clan = await Clan.getFromUser(interaction.user.id);
                if(!clan) return interaction.editReply({
                    content: `You are not in a clan.`,
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
                const embed = new EmbedBuilder()
                    .setTitle(`${clan.name} - Lvl ${clan.level}`)
                    .setDescription(`${clan.members.length} members:\n${clan.getMembersRankSorted.map(async(m) => {
                        const player = await Player.get(m.id);
                        return `${m.rank} - ${player.getName()} ${m.totalContribution.xp} xp ${m.totalContribution.coins} coins contributed.\n`;
                    })}`)
                    .addFields(
                        {name: `XP Boost`, value: `${clan.stats.xpMultiplier}x`, inline: true},
                        {name: '\u200b', value: '\u200b', inline: true},
                        {name: `Coin Boost`, value: `${clan.stats.coinMultiplier}x`, inline: true},
                        {name: `Vault`, value: `${clan.vault}/${clan.maxVaulted} coins`, inline: true},
                        {name: `Experience`, value: `${clan.exp}/${clan.xpRequired}`, inline: true},
                        {name: `Stat Points`, value: `${clan.statPoints}`, inline: true},
                    )
                interaction.editReply({
                    embeds: [embed],
                    allowedMentions: {
                        repliedUser: player.ping
                    }
                });
            }
                
            break;
        }

        return
    }
}