/**
 * Represents the configuration for a player's UI.
 *
 * @constructor
 * @param {string} bgColor - The background color of the player's UI.
 * @param {string} textColor - The text color of the player's UI.
 * @param {string} bgXpColor - The background color of the player's XP bar.
 * @param {string} xpColor - The color of the player's XP bar.
 */
export class PlayerConfig {
    bgColor: string;
    textColor: string;
    bgXpColor: string;
    xpColor: string;

    constructor(
        bgColor: string,
        textColor: string,
        bgXpColor: string,
        xpColor: string
    ) {
        this.bgColor = bgColor;
        this.textColor = textColor;
        this.bgXpColor = bgXpColor;
        this.xpColor = xpColor;
    }
}
