import type { AutocompleteInteraction } from "discord.js";
import { Player } from "../../lib/library.js";
import {
    buy,
    equip,
    item,
    lootboxes,
    recipes,
    sell,
} from "../../lib/resources/autoCompletes.js";

export default {
    name: "autoCompleteInteraction",
    once: false,
    async execute(interaction: AutocompleteInteraction) {
        const { user, client } = interaction;
        if (user.bot) return;
        const player = await Player.get(user.id, client);
        const focusedValue = interaction.options.getFocused();
        let choices: { name: string; value: string }[] = [];
        switch (interaction.commandName) {
            case "lootbox":
                choices = lootboxes;
                break;

            case "shop":
                const subCmd = interaction.options.getSubcommand();
                if (subCmd === "buy") choices = buy;
                else if (subCmd === "sell")
                    choices = sell(player.backpackContent);
                break;

            case "item":
                choices = item;
                break;

            case "recipe":
                choices = recipes;
                break;

            case "craft":
                choices = recipes;
                break;

            case "equip":
                choices = equip;
                break;

            default:
                break;
        }

        const filtered = choices
            ?.filter((choice) =>
                choice.name.toLowerCase().includes(focusedValue.toLowerCase())
            )
            .slice(0, 25);
        await interaction.respond(
            filtered?.map((choice) => ({
                name: choice.name,
                value: choice.value,
            }))
        );
    },
};
