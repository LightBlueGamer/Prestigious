import * as lootboxes from "../../game/lootboxes";
import { Player } from "../../lib/structures/Player";

const boxes = Object.values(lootboxes);

export default {
    name: 'autoCompleteInteraction',
    once: false,
    async execute(interaction) {
        const { user } = interaction;
        if (user.bot) return;

        const focusedValue = interaction.options.getFocused();
        let choices = [];
        switch (interaction.commandName) {
            case "shop":
                choices = boxes.map(box => ({name: `${box.name}: ${box.price} coins each`, value: box.name}));
                
                break;

            case "open":
                const player = await Player.get(user.id);
                const boxxes = player.inventory.filter((item) => item.type.toLowerCase() === "lootbox");
                choices = boxxes.map(box => ({name: `${box.name}`, value: box.name}));
        
                break;
                
            default:
                break;
        }

        const filtered = choices?.filter(choice => choice.name.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 25);
        await interaction.respond(filtered?.map(choice => ({ name: choice.name, value: choice.value })));
    }
}