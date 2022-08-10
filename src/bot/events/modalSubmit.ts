import type { ModalSubmitInteraction } from "discord.js";
import { Player } from "../../lib/structures/Player";

export default {
    name: 'modalSubmit',
    once: false,
    async execute(interaction: ModalSubmitInteraction) {
        const { user, fields } = interaction;
        const player = await Player.get(user.id);
        const color = fields.getTextInputValue('colorInput');
        const ping = fields.getTextInputValue('pingInput');
        const name = fields.getTextInputValue('displayNameInput');
        let string = '';
        
        if (color) {
            if (!color.match(/rgb\((\d|[0-2]\d|[0-2][0-5]{1,2}), ?(\d|[0-2]\d|[0-2][0-5]{1,2}), ?(\d|[0-2]\d|[0-2][0-5]{1,2})\)|rgba\((\d|[0-2]\d|[0-2][0-5]{1,2}), ?(\d|[0-2]\d|[0-2][0-5]{1,2}), ?(\d|[0-2]\d|[0-2][0-5]{1,2}), ?((0|0\.\d*)|1)\)|#([a-f]|\d){6}/gim)) return interaction.reply({
                content: `The provided input was not a valid hex or rgb(a) code!`,
                allowedMentions: {
                    repliedUser: player.ping
                }
            });
            player.color = color;
            string += `You changed your preferred color to ${color}\n`
        };

        if (ping) {
            if (ping.match(/(on|off|true|false)/gim)) return interaction.reply({
                content: `The provided input was not on or off!`,
                allowedMentions: {
                    repliedUser: player.ping
                }
            });
            if(ping.match(/(on|true)/gim)) player.ping = true;
            if(ping.match(/(off|false)/gim)) player.ping = false;
            string += `You toggled your ping ${player.ping ? 'on.' : 'off.'}\n`
        }

        if (name) {
            player.displayName = name
            string += `You set your displayname to ${player.displayName}`
        }

        player.save();

        return interaction.reply({
            content: string,
            allowedMentions: {
                repliedUser: player.ping
            }
        });
    }
}