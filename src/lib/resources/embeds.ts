import { EmbedBuilder } from "discord.js";

/**
 * Creates a new Discord Embed with a green color and a default footer.
 *
 * @returns {EmbedBuilder} A new Discord Embed with the specified color and footer.
 *
 * @example
 * ```typescript
 * const greenEmbed = createGreenEmbed();
 * // Send the greenEmbed to a Discord channel
 * await channel.send({ embeds: [greenEmbed] });
 * ```
 */
export function greenEmbed() {
    return new EmbedBuilder()
        .setColor("Green")
        .setFooter({ text: "Prestigious 4 Made By Inferno and Tim" }); // Default
}

/**
 * Creates a new Discord Embed with a random color and a default footer.
 *
 * @returns {EmbedBuilder} A new Discord Embed with a random color and the specified footer.
 *
 * @example
 * ```typescript
 * const randomColorEmbed = randomEmbed();
 * // Send the randomColorEmbed to a Discord channel
 * await channel.send({ embeds: [randomColorEmbed] });
 * ```
 */
export function randomEmbed() {
    return new EmbedBuilder()
        .setColor("Random")
        .setFooter({ text: "Prestigious 4 Made By Inferno and Tim" }); // Default
}

/**
 * Creates a new Discord Embed with a red color and a default footer.
 *
 * @returns {EmbedBuilder} A new Discord Embed with the specified color and footer.
 *
 * @example
 * ```typescript
 * const redEmbed = createRedEmbed();
 * // Send the redEmbed to a Discord channel
 * await channel.send({ embeds: [redEmbed] });
 * ```
 */
export function redEmbed() {
    return new EmbedBuilder()
        .setColor("Red")
        .setFooter({ text: "Prestigious 4 Made By Inferno and Tim" }); // Default
}

/**
 * Creates a new Discord Embed with a blue color and a default footer.
 *
 * @returns {EmbedBuilder} A new Discord Embed with the specified color and footer.
 *
 * @example
 * ```typescript
 * const blueEmbed = createBlueEmbed();
 * // Send the blueEmbed to a Discord channel
 * await channel.send({ embeds: [blueEmbed] });
 * ```
 */
export function blueEmbed() {
    return new EmbedBuilder()
        .setColor("Blurple")
        .setFooter({ text: "Prestigious 4 Made By Inferno and Tim" }); // Default
}

/**
 * Creates a new Discord Embed with a luminous vivid pink color and a default footer.
 *
 * @returns {EmbedBuilder} A new Discord Embed with the specified color and footer.
 *
 * @example
 * ```typescript
 * const pinkEmbed = createPinkEmbed();
 * // Send the pinkEmbed to a Discord channel
 * await channel.send({ embeds: [pinkEmbed] });
 * ```
 */
export function pinkEmbed() {
    return new EmbedBuilder()
        .setColor("LuminousVividPink")
        .setFooter({ text: "Prestigious 4 Made By Inferno and Tim" }); // Default
}

/**
 * Creates a new Discord Embed with an orange color and a default footer.
 *
 * @returns {EmbedBuilder} A new Discord Embed with the specified color and footer.
 *
 * @example
 * ```typescript
 * const orangeEmbed = createOrangeEmbed();
 * // Send the orangeEmbed to a Discord channel
 * await channel.send({ embeds: [orangeEmbed] });
 * ```
 */
export function orangeEmbed() {
    return new EmbedBuilder()
        .setColor("Orange")
        .setFooter({ text: "Prestigious 4 Made By Inferno and Tim" }); // Default
}

/**
 * Creates a new Discord Embed with a dark green color and a default footer.
 *
 * @returns {EmbedBuilder} A new Discord Embed with the specified color and footer.
 *
 * @example
 * ```typescript
 * const darkGreenEmbed = createDarkGreenEmbed();
 * // Send the darkGreenEmbed to a Discord channel
 * await channel.send({ embeds: [darkGreenEmbed] });
 * ```
 */
export function darkGreenEmbed() {
    return new EmbedBuilder()
        .setColor("DarkGreen")
        .setFooter({ text: "Prestigious 4 Made By Inferno and Tim" }); // Default
}

/**
 * Creates a new Discord Embed with a grey color and a default footer.
 *
 * @remarks
 * This function is used to create a new Discord Embed with a specific color and footer.
 * The color is set to grey, and the footer text is set to "Prestigious 4 Made By Inferno and Tim".
 *
 * @returns {EmbedBuilder} A new Discord Embed with the specified color and footer.
 *
 * @example
 * ```typescript
 * const greyEmbed = createGreyEmbed();
 * // Send the greyEmbed to a Discord channel
 * await channel.send({ embeds: [greyEmbed] });
 * ```
 */
export function greyEmbed() {
    return new EmbedBuilder()
        .setColor("Grey")
        .setFooter({ text: "Prestigious 4 Made By Inferno and Tim" }); // Default
}
