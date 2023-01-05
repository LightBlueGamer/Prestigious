import { EmbedBuilder } from "@discordjs/builders";
import { APIEmbed, Colors } from "discord.js";

export class GreenEmbed extends EmbedBuilder {
    constructor(data?: APIEmbed) {
        super(data);
        this.setColor(Colors.Green)
    };
};