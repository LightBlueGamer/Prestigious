import { emojis } from "../resources/emojis.js";
import type { Item } from "../classes/Item.js";
import type { Player } from "../classes/Player.js";
import { backpacks } from "../resources/backpacks.js";
import { Attribute } from "../library.js";
import { PrestigeAttribute } from "../classes/PrestigeAttribute.js";
import { items as cItems } from "../resources/items.js";

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
        backpack: backpacks.Pouch,
        lootboxes: [],
        statistics: [],
        class: null,
        attributes: generateAttributes(),
        statPoints: 18,
        prestigePoints: 0,
        prestigeAttributes: generatePrestigeAttributes(),
    };
}

/**
 * A function to generate an array of default attributes for a player.
 *
 * @returns {Attribute[]} - An array of Attribute objects, each representing a default attribute.
 *                          The attributes are: Strength, Dexterity, Intelligence, Constitution, Charisma, and Wisdom.
 *                          All attributes are initialized with a value of 0.
 *
 * @example
 * ```typescript
 * const playerAttributes = generateAttributes();
 * console.log(playerAttributes); // [Attribute { name: 'Strength', value: 0 }, Attribute { name: 'Dexterity', value: 0 }, ...]
 * ```
 */
export function generateAttributes(): Attribute[] {
    return [
        new Attribute("Strength", 0),
        new Attribute("Dexterity", 0),
        new Attribute("Intelligence", 0),
        new Attribute("Constitution", 0),
        new Attribute("Charisma", 0),
        new Attribute("Wisdom", 0),
    ];
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

/**
 * Generates a string representation of a progress bar using Discord emoji characters.
 *
 * @param amount - The number of blue squares to display in the progress bar.
 *                  Must be a non-negative integer less than or equal to 10.
 *
 * @returns {string} - A string representing the progress bar.
 *                      The progress bar consists of `amount` blue squares followed by
 *                      (10 - `amount`) black large squares.
 *
 * @example
 * ```typescript
 * const progress = attributeBar(5);
 * console.log(progress); // ":blue_square::blue_square::blue_square::blue_square::blue_square::black_large_square::black_large_square::black_large_square::black_large_square::black_large_square:"
 * ```
 */
export function attributeBar(amount: number): string {
    return (
        ":blue_square:".repeat(amount) +
        ":black_large_square:".repeat(10 - amount)
    );
}

/**
 * Generates an array of default prestige attributes for a player.
 *
 * @returns {PrestigeAttribute[]} - An array of PrestigeAttribute objects, each representing a default prestige attribute.
 *                                  The attributes are: ExperienceBoost and MoneyBoost.
 *                                  All attributes are initialized with a value of 0.
 *
 * @example
 * ```typescript
 * const prestigeAttributes = generatePrestigeAttributes();
 * console.log(prestigeAttributes); // [PrestigeAttribute { name: 'ExperienceBoost', value: 0 }, PrestigeAttribute { name: 'MoneyBoost', value: 0 }]
 * ```
 */
export function generatePrestigeAttributes(): PrestigeAttribute[] {
    return [
        new PrestigeAttribute("ExperienceBoost", 0),
        new PrestigeAttribute("MoneyBoost", 0),
    ];
}

/**
 * Calculates the chance of obtaining a specific item based on its weight compared to all items.
 *
 * @param itemName - The name of the item to calculate the chance for.
 *
 * @returns A number representing the chance of obtaining the specified item, or null if the item is not found.
 *          The chance is calculated as the ratio of the item's weight to the total weight of all items,
 *          multiplied by 100 to get a percentage.
 *
 * @example
 * ```typescript
 * const chance = calculateItemChance("Example Item");
 * console.log(chance); // 25 (if Example Item has a weight of 1 and total weight of 4)
 * ```
 *
 * @remarks
 * If the specified item is not found in the `cItems` array, an error message is logged to the console,
 * and the function returns null.
 */
export function calculateItemChance(itemName: string): number | null {
    const items = Object.values(cItems);
    const item = items.find(
        (i) => i.name.toLowerCase() === itemName.toLowerCase()
    );

    if (!item) {
        console.error(`Item "${itemName}" not found.`);
        return null;
    }

    const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);

    return (item.weight / totalWeight) * 100;
}

/**
 * Formats a number by converting it to a string with a specific number of decimal places.
 * If the value is zero, it returns '0'.
 *
 * @param value - The number to format.
 *
 * @returns A string representation of the number with a specific number of decimal places.
 *          If the value is zero, it returns '0'.
 *
 * @example
 * ```typescript
 * const formattedNumber = formatNumber(12345.6789);
 * console.log(formattedNumber); // "12345.68"
 * ```
 *
 * @remarks
 * The function calculates the magnitude of the number using `Math.log10(Math.abs(value))`.
 * If the magnitude is greater than or equal to zero, it sets the precision to 2 decimal places.
 * Otherwise, it calculates the precision as `Math.max(0, -magnitude + 2)`.
 * Finally, it uses `value.toFixed(precision)` to format the number and returns the result.
 */
export function formatNumber(value: number): string {
    if (value === 0) return "0";

    const magnitude = Math.floor(Math.log10(Math.abs(value)));
    let precision: number;

    if (magnitude >= 0) {
        precision = 2;
    } else {
        precision = Math.max(0, -magnitude + 2);
    }

    return value.toFixed(precision);
}
