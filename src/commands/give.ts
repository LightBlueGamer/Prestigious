import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
//import { Player } from '../lib/game/Player.js';
export default {
    devMode: true,
    data: new SlashCommandBuilder()
        .setName("give")
        .setDescription("Give a item from your backpack to someone else")
        .addUserOption((option) =>
            option
                .setName(`user`)
                .setDescription(`The user to show the profile of`)
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("item")
                .setDescription("The item to give to the other user.")
                .setAutocomplete(true)
                .setRequired(true)
        )
        .setDMPermission(false),
    async execute (interaction: ChatInputCommandInteraction) {
        await interaction.deferReply();

        //const { user, client, options } = interaction;
        //const userOption = options.getUser("user", true);

        //const player = await Player.get(user.id, client);
        //const toGive = await Player.get(userOption.id, client);

    },
};