import { SlashCommandBuilder } from "discord.js";

export class Command {
    data;
    execute;
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
}