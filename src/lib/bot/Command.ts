import type {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

export class Command {
    devMode: boolean;
    data: Command.Data;
    execute: Function;
    constructor(
        devMode: boolean,
        data: SlashCommandBuilder,
        execute: (interaction: ChatInputCommandInteraction) => {}
    ) {
        this.devMode = devMode;
        this.data = data;
        this.execute = execute;
    }
}

export namespace Command {
    export type devMode = boolean;
    export type Data = SlashCommandBuilder;
    export namespace Data {
        export type Name = string;
    }
}
