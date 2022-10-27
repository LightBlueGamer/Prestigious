import type { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export class Command {
    data: Command.Data;
    execute: Command.Execute;
    constructor(
        data: Command.Data,
        execute: Command.Execute
    ) {
        this.data = data;
        this.execute = execute;
    }
}

export namespace Command {
    export type Data = SlashCommandBuilder;
    export namespace Data {
        export type Name = string;
    }
    export type Execute = (i: ChatInputCommandInteraction) => void;
}