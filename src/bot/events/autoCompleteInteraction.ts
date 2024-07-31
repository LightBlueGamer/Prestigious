import type { AutocompleteInteraction } from "discord.js";
import { commands } from "../../index.js";
import { CraftableItem, Player, items } from "../../lib/library.js";

export default {
    name: "autoCompleteInteraction",
    once: false,
    async execute(interaction: AutocompleteInteraction) {
        const { user, client } = interaction;
        if (user.bot) return;
        const player = await Player.get(user.id, client);
        const boxes = player.getLootboxes();

        const focusedValue = interaction.options.getFocused();
        let choices: { name: string; value: string }[] = [];
        switch (interaction.commandName) {
            case "lootbox":
                {
                    choices = boxes.map((box) => ({
                        name: `${box.name}`,
                        value: box.name,
                    }));
                }

                break;

            case "shop":
                {
                    const subCmd = interaction.options.getSubcommand();
                    let filteredItems;
                    if (subCmd === "buy") {
                        filteredItems = Object.values(items).filter(
                            (item) =>
                                item.buy &&
                                Math.ceil(item.value * 1.3) <=
                                    player.getBalance()
                        );
                        choices = filteredItems.map((item) => ({
                            name: ` ${item.name} for $${Math.ceil(item.value * 1.3)}/item`,
                            value: `${item.name}`,
                        }));
                    } else if (subCmd === "sell") {
                        filteredItems = player.getBackpackContents();
                        choices = filteredItems.map((item) => ({
                            name: `${item.name} for $${item.value}/item`,
                            value: `${item.name}`,
                        }));
                    }
                }

                break;

            case "item":
                {
                    choices = Object.values(items).map((item) => ({
                        name: `${item.name}`,
                        value: `${item.name}`,
                    }));
                }

                break;

            case "toggle":
                {
                    choices = commands.map((cmd) => ({
                        name: cmd.data.name,
                        value: cmd.data.name,
                    }));
                }

                break;

            case "recipe":
                {
                    choices = Object.values(items)
                        .filter((item) => item instanceof CraftableItem)
                        .map((item) => ({ name: item.name, value: item.name }));
                }

                break;

            case "craft":
                {
                    choices = Object.values(items)
                        .filter((item) => item instanceof CraftableItem)
                        .map((item) => ({ name: item.name, value: item.name }));
                }

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
