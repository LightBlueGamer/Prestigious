import type { AutocompleteInteraction } from "discord.js";
import * as lootboxes from "../../game/lootboxes";
import { Player } from "../../lib/structures/Player";
import { clans } from "../../database/main";

const boxes = Object.values(lootboxes);

export default {
    name: 'autoCompleteInteraction',
    once: false,
    async execute(interaction: AutocompleteInteraction) {
        const { user } = interaction;
        if (user.bot) return;

        const focusedValue = interaction.options.getFocused();
        let choices: { name: string; value: string; }[] = [];
        switch (interaction.commandName) {
            case "shop":
                choices = boxes.map(box => ({name: `${box.name}: ${box.price} coins each`, value: box.name}));
                
                break;

            case "open":
                const player = await Player.get(user.id);
                const boxxes = player.inventory.filter((item) => item.type.toLowerCase() === "lootbox");
                choices = boxxes.map(box => ({name: `${box.name}`, value: box.name}));
        
                break;

            case "clan": {
                const subCommand = interaction.options.getSubcommand();
                switch (subCommand) {
                    case "search": {
                        choices = (await clans.values).map(clan => ({name: clan.name, value: clan.name}));
                    }
                    
                    break;

                    case "join": {
                        choices = (await clans.values).filter(clan => clan.invites.includes(interaction.user.id)).map(clan => ({name: clan.name, value: clan.name}));
                    }

                    break;
                
                    default:
                        break;
                }
            }

            break;
                
            default:
                break;
        }

        const filtered = choices?.filter(choice => choice.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 25);
        await interaction.respond(filtered?.map(choice => ({ name: choice.name, value: choice.value })));
    }
}