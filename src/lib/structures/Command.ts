import type { SlashCommandBuilder } from "discord.js";

export interface Command {
    data: Command.Data;
    execute: Function;
}

export namespace Command {
    export type Data = SlashCommandBuilder;
    export type Name = string;
}