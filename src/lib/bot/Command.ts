import type {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import type { Modules } from "./Modules";

export class Command {
    devMode: boolean;
    module: Command.Module;
    data: Command.Data;
    execute: Function;
    constructor(
        devMode: boolean,
        module: Command.Module,
        data: SlashCommandBuilder,
        execute: (interaction: ChatInputCommandInteraction) => {}
    ) {
        this.devMode = devMode;
        this.module = module;
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

    export type Module = Modules;
}
