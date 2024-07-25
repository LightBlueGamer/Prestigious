import { Pouch } from "../game/backpacks.js";
import { emojis } from "../lib/bot/emojis.js";
import type { Item } from "../lib/game/Item.js";
import type { Player } from "../lib/game/Player.js";

/**
 * A function to generate the default player data.
 *
 * @returns {Player.Data} - The default player data.
 *
 * @example
 * ```typescript
 * const playerData = generateData();
 * console.log(playerData); // { balance: 0, xp: 0, level: 1, prestige: 0, backpack: Pouch, lootboxes: [] };
 * ```
 */
export function generateData(): Player.Data {
    return {
        balance: 0,
        xp: 0,
        level: 1,
        prestige: 0,
        backpack: Pouch,
        lootboxes: [],
        statistics: [],
        class: null,
        attributes: []
    };
}

/**
 * A function to generate a random number between min and max.
 * @param min - The minimum value.
 * @param max - The maximum value.
 * @returns A random number between min and max.
 */
export function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * A function to get an emoji by its name.
 *
 * @param name - The name of the emoji.
 * @returns A string representation of the emoji in Discord format.
 *          If the emoji is not found, an empty string is returned.
 *
 * @example
 * ```typescript
 * const happyEmoji = getEmoji('smile');
 * console.log(happyEmoji); // <:smile:1234567890>
 * ```
 *
 * @remarks
 * The `emojis` array is assumed to be defined elsewhere in the codebase.
 * Each emoji object in the array should have properties `name` and `id`.
 */
export function getEmoji(name: string): string {
    const emoji = emojis.find((e) => e.name === name);
    return emoji ? `<:${emoji.name}:${emoji.id}>` : "";
}

/**
 * Converts a number to its corresponding word representation.
 *
 * @param number - The number to convert.
 * @returns The word representation of the number.
 *
 * @example
 * const word = numberToWord(5);
 * console.log(word); // "five"
 */
export function numberToWord(number: number): string {
    const words = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
    ];
    return words[number];
}

/**
 * A function to get a random item from the item array based on their weights.
 *
 * @returns {Item} - A randomly selected item from the item array.
 *
 * @remarks
 * The weight of each item determines its likelihood of being selected.
 * The total weight of all items is calculated, and a random number between 0 and the total weight is generated.
 * The function then iterates through the item array, subtracting the weight of each item from the random number.
 * When the random number becomes less than or equal to 0, the corresponding item is returned.
 * If something goes wrong and no item is selected, the last item in the array is returned.
 *
 * @example
 * const randomItem = getRandomItemByWeight();
 * console.log(randomItem.name); // "Example Item"
 */
export function getRandomItemByWeight(items: Item[]): Item {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

    let random = Math.random() * totalWeight;

    for (const item of items) {
        random -= item.weight;
        if (random <= 0) {
            return item;
        }
    }

    return items[items.length - 1];
}

/**
 * A function to get a random lootbox item from the lootbox item array based on their weights.
 * The weight of each item is multiplied by its bonus to determine its likelihood of being selected.
 *
 * @param items - An array of lootbox items. Each item has an `item` property (of type `Item`) and a `bonus` property (number).
 * @returns {LootboxItem} - A randomly selected lootbox item from the lootbox item array.
 *
 * @remarks
 * The total weight of all items is calculated, and a random number between 0 and the total weight is generated.
 * The function then iterates through the lootbox item array, subtracting the weighted weight of each item from the random number.
 * When the random number becomes less than or equal to 0, the corresponding item is returned.
 * If something goes wrong and no item is selected, the last item in the array is returned.
 *
 * @example
 * const lootboxItems: LootboxItem[] = [
 *   { item: { name: "Example Item 1", weight: 1 }, bonus: 2 },
 *   { item: { name: "Example Item 2", weight: 2 }, bonus: 1 },
 * ];
 * const randomLootboxItem = getRandomLootboxItemByWeight(lootboxItems);
 * console.log(randomLootboxItem.item.name); // "Example Item 1" or "Example Item 2"
 */
export function getRandomLootboxItemByWeight(items: Item[]): Item {
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);

    let random = Math.random() * totalWeight;

    for (const item of items) {
        random -= item.weight;
        if (random <= 0) {
            return item;
        }
    }

    return items[items.length - 1];
}

/**
 * A function to generate a random hexadecimal color code.
 *
 * @returns {string} - A random hexadecimal color code in the format '#RRGGBB'.
 *
 * @example
 * const randomColor = getRandomHexColor();
 * console.log(randomColor); // "#FFA07A" or any other random color
 */
export function getRandomHexColor(): string {
    const randomInt = Math.floor(Math.random() * 16777215);
    const hexColor = randomInt.toString(16).padStart(6, "0");
    return `#${hexColor}`;
}
