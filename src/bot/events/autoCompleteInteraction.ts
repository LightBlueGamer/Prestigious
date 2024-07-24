import type { AutocompleteInteraction } from "discord.js";
import { Player } from "../../lib/game/Player.js";
import * as cItems from "../../game/items.js";
import { commands } from "../../index.js";

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
                    const amount = interaction.options.getNumber(
                        "amount",
                        true
                    );
                    let items;
                    if (subCmd === "buy") {
                        items = Object.values(cItems).filter(
                            (item) =>
                                item.buy &&
                                Math.ceil(item.value * 1.3 * amount) <=
                                    player.getBalance()
                        );
                        choices = items.map((item) => ({
                            name: `${amount}x ${item.name} for $${Math.ceil(item.value * 1.3 * amount)}`,
                            value: `${item.name}`,
                        }));
                    } else if (subCmd === "sell") {
                        items = player.getBackpackContents();
                        choices = items.map((item) => ({
                            name: `${amount}x ${item.name} for $${item.value * amount}`,
                            value: `${item.name}`,
                        }));
                    }
                }

                break;

            case "item":
                {
                    choices = Object.values(cItems).map((item) => ({
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
