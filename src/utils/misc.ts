import { Items } from "../lib/game/Catalog.js";
import type { Item } from "../lib/game/Item.js";

/**
 * Gets the correct ordinal from a number
 * @param n The number to get the ordinal from
 * @returns string
 */
export function getOrdinal(n: number) {
    let s = ["th", "st", "nd", "rd"];
    let v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/**
 * Returns a random number between the minimum and maximum number specified
 * @param min The minimum amount to choose from
 * @param max The maximum amount to choose from
 * @returns number
 */
export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Returns the input string with the first letter capitalized
 * @param string The string to capitalize
 * @returns string
 */
export function firstLetterUppercase(string: string) {
    return string.replace(string[0], string[0].toUpperCase());
}

/**
 * Returns a random item based on the items weight.
 * @returns Item
 */
export function getRandomItem(items: Item[]) {
    const itemsArr = items;
    const total = itemsArr.reduce((p, c) => p + c.weight, 0);
    const random = Math.random() * total;
    let curWeight = 0;
    for (let item of itemsArr) {
        curWeight += item.weight;
        if (random < curWeight) return item;
    }
    return Items.Stone;
}
