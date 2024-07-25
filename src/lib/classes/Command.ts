import type {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
} from "discord.js";
import type { Modules } from "../enums/Modules";

/**
 * Represents a command for a Discord bot.
 */
export class Command {
    /**
     * Indicates whether the command is in development mode.
     */
    devMode: boolean;

    /**
     * The module the command belongs to.
     */
    module: Command.Module;

    /**
     * The data for the command, including its name, description, options, etc.
     */
    data: Command.Data;

    /**
     * The function to execute when the command is invoked.
     */
    execute: Function;

    /**
     * Constructs a new Command instance.
     * @param devMode - Indicates whether the command is in development mode.
     * @param module - The module the command belongs to.
     * @param data - The data for the command, including its name, description, options, etc.
     * @param execute - The function to execute when the command is invoked.
     */
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
    /**
     * Represents the type for the `devMode` property.
     */
    export type devMode = boolean;

    /**
     * Represents the type for the `data` property.
     */
    export type Data = SlashCommandBuilder;

    export namespace Data {
        /**
         * Represents the type for the command name.
         */
        export type Name = string;
    }

    /**
     * Represents the type for the `module` property.
     */
    export type Module = Modules;
}
