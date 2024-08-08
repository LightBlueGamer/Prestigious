import { emojis } from "../resources/emojis.js";
import { Item } from "../classes/Item.js";
import type { Player } from "../classes/Player.js";
import { backpacks } from "../resources/backpacks.js";
import { PrestigeAttribute } from "../classes/PrestigeAttribute.js";
import { items as cItems, items } from "../resources/items.js";
import * as fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { Attribute } from "../classes/Attribute.js";
import { Equipment } from "../classes/Equipment.js";
import { LegArmor } from "../classes/LegArmor.js";
import { Cuirass } from "../classes/Cuirass.js";
import { Helmet } from "../classes/Helmet.js";
import { Shield } from "../classes/Shield.js";
import { Weapon } from "../classes/Weapon.js";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    type EmbedField,
    type User,
} from "discord.js";
import { BackpackEquipment } from "../classes/BackpackEquipment.js";
import { blueEmbed, randomEmbed } from "../resources/embeds.js";
import type { PityItem } from "../interfaces/PityItem.js";
import type { Backpack } from "../classes/Backpack.js";
import { PlayerSaveManager } from "../classes/PlayerSaveManager.js";
import { writeFileSync } from "fs";

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
        equipment: new Equipment(),
        premium: false,
        pity: generatePityData(),
        excessItems: [],
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
export function getRandomItemByWeight(items: Item[], pity: PityItem[]): Item {
    const totalWeight = items.reduce((sum, item) => {
        const pityWeight =
            pity.find(
                (i) => i.item.name.toLowerCase() === item.name.toLowerCase()
            )?.pity || 0;
        return sum + (item.weight + pityWeight);
    }, 0);

    let random = Math.random() * totalWeight;

    for (const item of items) {
        const pityWeight =
            pity.find(
                (i) => i.item.name.toLowerCase() === item.name.toLowerCase()
            )?.pity || 0;
        random -= item.weight + pityWeight;
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
 * Calculates the pity chance for a specific item based on its pity count and the total weight of all items.
 *
 * @param itemName - The name of the item for which to calculate the pity chance.
 * @param pityItems - An array of PityItem objects, where each object contains an item and its pity count.
 *
 * @returns The pity chance for the specified item as a number between 0 and 100, or null if the item is not found.
 *
 * @remarks
 * This function finds the PityItem object for the specified item name and calculates the pity chance based on its pity count and the total weight of all items.
 * If the item is not found, it logs an error message and returns null.
 */
export function calculateItemPityChance(
    itemName: string,
    pityItems: PityItem[]
): number | null {
    const item = pityItems.find(
        (i) => i.item.name.toLowerCase() === itemName.toLowerCase()
    );

    if (!item) {
        console.error(`Item "${itemName}" not found.`);
        return null;
    }

    const totalWeight = Object.values(items).reduce(
        (sum, i) => sum + (i.weight + item.pity),
        0
    );

    return (item.pity / totalWeight) * 100;
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

/**
 * Retrieves the data from the project's package.json file.
 *
 * @returns {PackageJson} - The parsed JSON data from the package.json file.
 *
 * @remarks
 * This function reads the package.json file located in the root directory of the project.
 * It uses the `fs.readFileSync` method to read the file's content as a UTF-8 string.
 * Then, it uses `JSON.parse` to parse the string into a JavaScript object, which is returned.
 *
 * @example
 * ```typescript
 * const packageData = getPackageJSONData();
 * console.log(packageData.name); // "your-project-name"
 * console.log(packageData.version); // "1.0.0"
 * ```
 */
export function getPackageJSONData(): PackageJson {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const packageJsonPath = join(__dirname, "../../..", "package.json");
    const data = fs.readFileSync(packageJsonPath, "utf-8");
    return JSON.parse(data);
}

/**
 * Finds an item in the `items` object by its name.
 *
 * @param name - The name of the item to find. The search is case-insensitive.
 *
 * @returns The item object if found, or `undefined` if not found.
 *          The function assumes that the `items` object has a structure where each item is a value of the object,
 *          and each item has a `name` property (string).
 *
 * @example
 * ```typescript
 * const foundItem = findItem("Example Item");
 * if (foundItem) {
 *     console.log(`Found item: ${foundItem.name}`);
 * } else {
 *     console.log("Item not found.");
 * }
 * ```
 *
 * @remarks
 * The function uses the `Object.values` method to get an array of all item values.
 * It then uses the `Array.prototype.find` method to find an item whose name matches the given name (case-insensitive).
 * If an item is found, it is returned; otherwise, `undefined` is returned.
 *
 * @throws Will throw an error if the `items` object is not defined or if it does not have the expected structure.
 */
export function findItem(name: string) {
    return Object.values(items).find(
        (item) => item.name.toLowerCase() === name.toLowerCase()
    );
}

/**
 * Checks if a given item is an instance of any equipment class.
 *
 * @param item - The item to check.
 *
 * @returns `true` if the item is an instance of any equipment class (Cuirass, Helmet, LegArmor, Shield, or Weapon),
 *          `false` otherwise.
 *
 * @example
 * ```typescript
 * const isEquipment = itemIsEquipment(new Cuirass("Example Cuirass", 100, 5));
 * console.log(isEquipment); // true
 * ```
 *
 * @remarks
 * This function uses the `instanceof` operator to check if the given item is an instance of any of the equipment classes.
 * It returns `true` if the item is an instance of any of the equipment classes, and `false` otherwise.
 */
export function itemIsEquipment(item: Item) {
    return (
        item instanceof Cuirass ||
        item instanceof Helmet ||
        item instanceof LegArmor ||
        item instanceof Shield ||
        item instanceof Weapon ||
        item instanceof BackpackEquipment
    );
}

/**
 * Generates an array of Discord embed fields for a leaderboard.
 *
 * @param sorted - An array of players sorted by their ranking criteria.
 * @param user - The Discord user for whom the leaderboard is being generated.
 * @param type - The type of leaderboard to generate. Can be either 'balance' or 'prestige'.
 * @param page - The page number of the leaderboard to generate.
 *
 * @returns An array of Discord embed fields representing the leaderboard.
 *
 * @remarks
 * The function generates leaderboard fields for a given page of players,
 * highlighting the user's position in the leaderboard.
 * Each field contains the player's rank, name, and relevant statistics (balance or prestige).
 * The fields are formatted for inline display.
 */
export function generateLeaderboardFields(
    sorted: Player[],
    user: User,
    type: string,
    page: number
): EmbedField[] {
    const fields: EmbedField[] = [];

    sorted.slice((page - 1) * 10, (page - 1) * 10 + 10).forEach((player, i) => {
        const rank = i + (page - 1) * 10 + 1;
        const name =
            player.id === user.id
                ? `#${rank} ${player.name} (You)`
                : `#${rank} ${player.name}`;
        const value =
            type === "balance"
                ? `Balance: ${player.data.balance}\nPrestige: ${player.data.prestige}\nLevel: ${player.data.level}\nXP: ${player.data.xp}`
                : `Prestige: ${player.data.prestige}\nLevel: ${player.data.level}\nXP: ${player.data.xp}\nBalance: ${player.data.balance}`;

        if (i % 2 === 0) {
            fields.push({
                name,
                value,
                inline: true,
            });
        } else {
            fields.push({
                name: `\u200b`,
                value: `\u200b`,
                inline: true,
            });
            fields.push({
                name,
                value,
                inline: true,
            });
        }
    });

    return fields;
}

/**
 * Calculates the general ranking of players based on prestige, level, XP, and balance.
 *
 * @param playerList - An array of players to calculate the ranking for.
 *
 * @returns A new array of players sorted by their general ranking.
 *          Players with higher prestige points are ranked higher.
 *          If prestige points are equal, players with higher levels are ranked higher.
 *          If prestige points and levels are equal, players with higher XP are ranked higher.
 *          If prestige points, levels, and XP are equal, players with higher balances are ranked higher.
 *
 * @example
 * const sortedPlayers = calculateGeneralRanking(playerList);
 * console.log(sortedPlayers[0].name); // "Player with highest prestige"
 */
export function calculateGeneralRanking(playerList: Player[]): Player[] {
    return playerList.sort(
        (a, b) =>
            b.data.prestige - a.data.prestige ||
            b.data.level - a.data.level ||
            b.data.xp - a.data.xp ||
            b.data.balance - a.data.balance
    );
}

/**
 * Generates an embed for a trade between two players.
 *
 * @param trade - The trade object containing the details of the trade.
 * @returns An EmbedBuilder object representing the trade embed.
 *
 * @remarks
 * The function takes a trade object as input, extracts the details of the two players involved in the trade,
 * and constructs an embed using the blueEmbed function. The embed title is set to indicate the trade between the two players' names.
 * Two fields are added to the embed, one for each player, displaying their money and items involved in the trade.
 * The money is displayed in parentheses, and the items are displayed in a code block with their quantities and names.
 * The function returns the constructed EmbedBuilder object.
 */
export function generateTradeEmbed(trade: TradeObject): EmbedBuilder {
    const { p1, p2 } = trade;
    return blueEmbed()
        .setTitle(`Trade between ${p1.name} and ${p2.name}`)
        .addFields([
            {
                name: `${p1.accepted ? "✅" : "❌"} ${p1.name} ($${p1.money}) — ${p1.accepted ? "Accepted" : "Trading"}`,
                value: `\`\`\`\u200b${p1.items.map((item) => `${item.quantity}x ${item.name}`).join("\n")}\`\`\``,
            },
            {
                name: `${p2.accepted ? "✅" : "❌"} ${p2.name} ($${p2.money}) — ${p2.accepted ? "Accepted" : "Trading"}`,
                value: `\`\`\`\u200b${p2.items.map((item) => `${item.quantity}x ${item.name}`).join("\n")}\`\`\``,
            },
        ]);
}

/**
 * Generates a Discord action row with buttons for a trade interface.
 * Each button has a custom ID and a style, and their labels are set accordingly.
 *
 * @returns A new ActionRowBuilder object with the trade interface buttons added as components.
 */
export function generateTradeButtons() {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId("set_money")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Set Money"),
        new ButtonBuilder()
            .setCustomId("add_item")
            .setStyle(ButtonStyle.Primary)
            .setLabel("Add Item"),
        new ButtonBuilder()
            .setCustomId("remove_item")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Remove Item")
    );
}

/**
 * Generates a Discord action row with buttons for a trade interface.
 * Each button has a custom ID and a style, and their labels are set accordingly.
 *
 * @returns A new ActionRowBuilder object with the trade interface buttons added as components.
 *
 * @remarks
 * The function creates two buttons: one with the custom ID "accept_trade", style ButtonStyle.Success, and label "Accept Trade",
 * and another with the custom ID "cancel_trade", style ButtonStyle.Danger, and label "Cancel Trade".
 * These buttons are then added to a new ActionRowBuilder object and returned.
 */
export function generateTradeAccCanButtons() {
    return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
            .setCustomId("accept_trade")
            .setStyle(ButtonStyle.Success)
            .setLabel("Accept Trade"),
        new ButtonBuilder()
            .setCustomId("cancel_trade")
            .setStyle(ButtonStyle.Danger)
            .setLabel("Cancel Trade")
    );
}

/**
 * Extracts all numbers from a given string, sums them up, and removes the numbers from the string.
 *
 * @param str - The input string from which to extract and sum numbers.
 *
 * @returns An object containing the sum of all numbers and the string without the numbers.
 *
 * @example
 * ```typescript
 * const result = extractAndSumNumbersAndText("Hello, I have 12 apples and 5 oranges.");
 * console.log(result.sum); // 17 (12 + 5)
 * console.log(result.text); // "Hello, I have  apples and  oranges."
 * ```
 */
export function extractAndSumNumbersAndText(str: string) {
    let numbers = str.match(/\d+/g);
    let sum = numbers ? numbers.map(Number).reduce((a, b) => a + b, 0) : 1;
    let text = str.replace(/\d+/g, "").trim();
    return {
        sum,
        text,
    };
}

/**
 * Adjusts the quantities of items in the target array based on the quantities in the source array.
 *
 * @param source - An array of TradeItem objects representing the source of items to adjust quantities from.
 * @param target - An array of TradeItem objects representing the target of items to adjust quantities in.
 *
 * @returns A new array of TradeItem objects representing the adjusted quantities in the target array.
 *          The returned array only includes items with a quantity greater than 0.
 *
 * @remarks
 * This function iterates through each item in the source array and finds a corresponding item in the target array.
 * If a corresponding item is found, the quantity of the target item is adjusted by subtracting the quantity of the source item.
 * Finally, the function filters out any items in the target array with a quantity less than or equal to 0 and returns the adjusted array.
 */
export function adjustQuantities(source: TradeItem[], target: TradeItem[]) {
    for (const srcItem of source) {
        const targetItem = target.find(
            (tItem) => tItem.name.toLowerCase() === srcItem.name.toLowerCase()
        );
        if (targetItem) {
            targetItem.quantity -= srcItem.quantity;
        }
    }

    return target.filter((item) => item.quantity > 0);
}

/**
 * Generates an array of PityItem objects, where each object represents an item and its corresponding pity count.
 * The pity count is initially set to 0 for all items.
 *
 * @returns An array of PityItem objects, where each object contains an item and its pity count.
 *
 * @remarks
 * This function iterates through each item in the `items` object and creates a new PityItem object for each item.
 * The pity count is set to 0 for all items. The function then returns the array of PityItem objects.
 */
export function generatePityData() {
    const pity: PityItem[] = [];
    for (const item of Object.values(items)) {
        if (item.weight <= 0) continue;
        pity.push({ item, pity: 0 });
    }
    return pity;
}

/**
 * Calculates the increase in pity number for a specific item based on its weight and the current pity count.
 *
 * @param item - The item for which to calculate the pity number increase.
 * @param pityItems - An array of PityItem objects, where each object contains an item and its pity count.
 *
 * @returns The increase in pity number as a rounded integer.
 *
 * @remarks
 * This function finds the PityItem object for the specified item and calculates the increase in pity number based on its weight and the current pity count.
 * The increase is calculated as the sum of the item's weight and the current pity count divided by 1000, and then rounded to the nearest integer.
 * If the item is not found in the pityItems array, the function assumes a pity count of 0 and calculates the increase accordingly.
 */
export function getPityNumberIncrease(item: Item, pityItems: PityItem[]) {
    const pity =
        pityItems.find(
            (i) => i.item.name.toLowerCase() === item.name.toLowerCase()
        )?.pity || 0;
    return Math.round((item.weight + pity) / 10);
}

/**
 * Generates an embed for displaying the contents of a player's backpack.
 *
 * @param items - An array of BackpackItem objects representing the items in the backpack.
 * @param page - The page number of the backpack to display.
 *
 * @returns A Discord EmbedBuilder object with the backpack contents formatted for display.
 *          The embed title is set to "Backpack", the description displays the items in the backpack,
 *          and the footer shows the current page number.
 *
 * @remarks
 * The function slices the items array to display only a portion of the items per page.
 * It then constructs a Discord embed using the randomEmbed function, setting the title, description,
 * and footer with the appropriate information.
 */
export function backpackEmbed(backpack: Backpack, page: number) {
    const sliced = backpack
        .getContents()
        .slice((page - 1) * 10, (page - 1) * 10 + 10);
    const embed = randomEmbed()
        .setTitle(
            `Backpack ${backpack.getContents().reduce((acc, item) => acc + item.size * item.amount, 0)}/${backpack.slots}`
        )
        .setDescription(
            sliced.length > 0
                ? "```\n" +
                      sliced
                          .map(
                              (item) =>
                                  `${item.size * item.amount} — ${item.amount}x ${item.name}`
                          )
                          .join("\n") +
                      "```"
                : "The backpack is empty"
        )
        .setFooter({
            text: `Page ${page}/${Math.ceil(backpack.getContents().length / 10)}`,
        });

    return embed;
}

/**
 * Sets up a graceful shutdown for the Discord bot client.
 * When the bot receives a SIGINT, SIGTERM, or SIGQUIT signal, it saves any pending data,
 * logs a shutdown message, and exits the process.
 * It also handles unhandled rejections and uncaught exceptions during shutdown.
 *
 * @param client - The Discord bot client for which to set up the graceful shutdown.
 *
 * @remarks
 * This function creates an instance of the PlayerSaveManager and sets up event listeners
 * for the SIGINT, SIGTERM, SIGQUIT, unhandledRejection, and uncaughtException signals.
 * When a signal is received, the function logs a shutdown message, saves any pending data,
 * and exits the process. If an error occurs during shutdown, it logs the error and exits with a non-zero status code.
 */
export function setupGracefulShutdown(client: Client) {
    const saveManager = PlayerSaveManager.getInstance();

    async function handleShutdown(signal: string) {
        console.log(`Received ${signal}, initiating shutdown...`);
        try {
            await saveManager.flushQueue();
            console.log("Shutdown complete, exiting process.");
            process.exit(0);
        } catch (error) {
            const date: StartJson = {
                time: client.readyAt!.getTime(),
                rewrite: true,
            };

            writeFileSync(
                join(__dirname, "../startDate.json"),
                JSON.stringify(date)
            );
            console.error("Error during shutdown:", error);
            process.exit(1);
        }
    }

    process.on("SIGINT", () => handleShutdown("SIGINT"));
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGQUIT", () => handleShutdown("SIGQUIT"));
    process.on("unhandledRejection", async (reason, promise) =>
        handleShutdown(
            `unhandledRejection at: ${await promise}, reason: ${reason}`
        )
    );
    process.on("uncaughtException", (error) =>
        handleShutdown(`uncaughtException: ${error.stack}`)
    );
}

/**
 * Summarizes an array of items by counting the occurrences of each item and returning an array of unique items with their respective counts.
 *
 * @param arr - The array of items to summarize.
 *
 * @returns An array of objects, where each object represents a unique item from the input array and its count.
 *
 * @example
 * ```typescript
 * const items = [
 *   { name: "Apple", quantity: 5 },
 *   { name: "Banana", quantity: 3 },
 *   { name: "Apple", quantity: 2 },
 *   { name: "Banana", quantity: 1 },
 * ];
 *
 * const summarizedItems = summarizeItems(items);
 * console.log(summarizedItems);
 * // Output: [
 * //   { item: { name: "Apple", quantity: 5 }, amount: 3 },
 * //   { item: { name: "Banana", quantity: 3 }, amount: 2 },
 * // ]
 * ```
 */
export function summarizeItems(arr: Item[]): { item: Item; amount: number }[] {
    const itemMap = new Map<string, { item: Item; amount: number }>();

    arr.forEach((item) => {
        if (itemMap.has(item.name)) {
            itemMap.get(item.name)!.amount += 1;
        } else {
            itemMap.set(item.name, { item, amount: 1 });
        }
    });

    return Array.from(itemMap.values());
}
