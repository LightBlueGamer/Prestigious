import type { UserContextMenuCommandInteraction } from 'discord.js';
import { Player } from '../../lib/structures/Player';

export default {
    data: {
        name: 'toggle bot pings',
        type: 2,
    },
    async execute(interaction: UserContextMenuCommandInteraction) {
        const user = interaction.targetId;
        const player = await Player.get(user);
        player.ping = !player.ping;
        interaction.reply({
            content: `You have toggled bot pings ${player.ping ? 'on.' : 'off'}`,
            allowedMentions: {
                repliedUser: player.ping
            }
        })
    },
};
