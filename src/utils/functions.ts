import { letters } from "../lib/misc/letters";

/**
 * Generates a random number between min and max
 * @param min Minimum number to return
 * @param max Maximum number to return
 * @returns Number
 */
export function random(min: number, max: number) {
    return Math.floor(Math.random()*(max - min + 1) + max);
};

/**
 * Gets the value of every single letter in a string
 * @param str The string to give a value
 * @returns Number
 */
export function valuate(str: string) {
    const arr = str.split('');
    let points = 0;
    console.log(letters["K"])

    for(const [i, l] of arr.entries()) {
        const letter = l.toUpperCase();
        if(!letters[letter]) return;
        console.log(points, l)
        if(i >= 2 && l === arr[i-2] && l === arr[i-1]) {
            points -= letters[letter] * 3
        }
        points += letters[letter];
    }
};

/**
 * Counts repeat values in a array and returns a array with key value form of the value 
 * and the repeat count
 * @param arr The array to count repeats in
 * @returns Array of key count objects
 */

export function countRepeats(arr: string[]) {
    const repeats = [];
    let count = 1;

    for(let i = 0; i < arr.length; i++) {
        if(!arr[i].match(/[a-z]/igm)) continue;
        if(arr[i] === arr[i+1]) count++;
        if(arr[i] !== arr[i+1]) {
            repeats.push({"key": arr[i], "count": count});
            count = 1;
        };
    };
    return repeats;
};

/**
 * Function the valuate all letters inside a array of key count pairs.
 * @param arr Array of key count objects.
 * @returns Number of points all the letters gives.
 */

export function valuateArr(arr: Array<{key: string, count: number}>) {
    let points = 0;
    for(const k of arr) {
        if(k.count >= 3) continue;
        else points += letters[k.key.toUpperCase()] * k.count;
    }
    return points;
};