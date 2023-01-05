import { letters } from "../lib/misc/letters";
import type Canvas from '@napi-rs/canvas';

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

/**
 * Function to return a random hex color.
 * @returns A random hex color.
 */

export function randomColor() {
    let color = '#';
    for (let i = 0; i < 6; i++){
       const random = Math.random();
       const bit = (random * 16) | 0;
       color += (bit).toString(16);
    }

    return color;
};

/**
 * Function to apply text to a canvas.
 * @param canvas The Canvas to apply text to.
 * @param text The text to apply to the canvas.
 * @returns A text for the canvas.
 */

export function applyText(canvas: Canvas.Canvas, text: string) {
    const context = canvas.getContext('2d');
    let fontSize = 55;

    do {
        context.font = `bold ${fontSize -= 10}px Noto Sans CJK JP`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
}

/**
 * Function to invert a hex color.
 * @param hex The hex color to invert.
 * @param bw If it should return in black and white format.
 * @returns The inverted color of the given hex.
 */

export function invertColor(hex: string, bw: boolean = true) {

    if(hex.startsWith('#')) {
        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
    
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
    
        if (hex.length !== 6) {
            throw new Error('Invalid HEX color.');
        }
    
        let r: string | number = parseInt(hex.slice(0, 2), 16),
            g: string | number = parseInt(hex.slice(2, 4), 16),
            b: string | number = parseInt(hex.slice(4, 6), 16);
    
        if (bw) {
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
    
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
    
        return "#" + r + g + b;
    } else {
        const rgb = hex.replace(/rgba?/gim, '').replace(/\(\)/gim, '').split(', ');
        let r: string | number = parseInt(rgb[0]),
            g: string | number = parseInt(rgb[1]),
            b: string | number = parseInt(rgb[2]);

        if (bw) {
            return (r * 0.299 + g * 0.587 + b * 0.114) > 186
                ? '#000000'
                : '#FFFFFF';
        }
    
        r = (255 - r).toString(16);
        g = (255 - g).toString(16);
        b = (255 - b).toString(16);
    
        return "#" + r + g + b;
    }
}