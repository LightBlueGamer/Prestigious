import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import * as lootboxes from "../../game/lootboxes";
import { Player } from "../../lib/structures/Player";

export default {
    data: new SlashCommandBuilder()
        .setName('open')
        .setDescription('Open a lootbox')
        .addStringOption(option => option.setName('lootbox').setDescription('The lootbox to open.').setAutocomplete(true).setRequired(true))
        .addNumberOption(option => option.setName('amount').setDescription('Amount to open'))
        .setDMPermission(false)
        .toJSON(),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();
        const { user } = interaction;
        const player = await Player.get(user.id);
        const amount = interaction.options.getNumber('amount');
        const box = interaction.options.getString('lootbox', true);
        const lootbox = Object.values(lootboxes).find(lootbox => lootbox.name.toLowerCase() === box.toLowerCase());
        
        if(!lootbox) return;

        const invItem = player.getItem(lootbox?.name!);
        if(!invItem) return;

        if(amount === 0) {
            return interaction.editReply({
                content: `You need to open minimum of 1 boxes`
            });
        };

        if(!amount || amount === 1) {
            const reward = lootbox?.open();
            
            if(!reward) return;

            player.addItem(reward, 1);
            player.removeItem(invItem, 1);
            player.save();
            return interaction.editReply({
                content: `You opened a ${invItem.name} and got a ${reward.rarity.name} ${reward.name}!`,
                allowedMentions: {
                    repliedUser: player.ping,
                }
            });
        } else {
            let rewards: [{amount: number, name: string}?] = [];
            for(let i=0; i<amount; i++) {
                const reward = lootbox?.open()!;
                player.addItem(reward, 1);
                const arrItem = rewards.find(x => x?.name === reward.name)
                if(arrItem) {
                    arrItem.amount++
                } else {
                    rewards.push({amount: 1, name: `${reward.rarity.name} ${reward.name}`});
                };
            };
            player.removeItem(invItem, amount);
            player.save();
            return interaction.editReply({
                content: `You opened ${amount} ${invItem.name} and got\`\`\`${rewards.map(x => `${x?.amount} - ${x?.name}`).join('\n')}\`\`\``,
                allowedMentions: {
                    repliedUser: player.ping,
                }
            })

        }
        
        
    }
}
