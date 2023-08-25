import { readdirSync, appendFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const logFiles = readdirSync(`${__dirname}/../logs`);

export function log(string: string) {
    const date = new Date();
    const fileName = `${date.getDate()}-${
        date.getMonth() + 1
    }-${date.getFullYear()}.log`;
    const logString = `LOG (${fixTime(date.getHours())}:${fixTime(
        date.getMinutes()
    )}:${fixTime(date.getSeconds())}): ${string}\n`;

    if (!logFiles.includes(fileName)) {
        writeFileSync(`${__dirname}/../logs/${fileName}`, logString);
        logFiles.push(fileName);
    } else {
        appendFileSync(`${__dirname}/../logs/${fileName}`, logString);
    }

    console.log(string);
}

function fixTime(number: number) {
    if (number.toString().length < 2) return parseInt(`0${number}`);
    else return number;
}
