import { Client, GatewayIntentBits } from "discord.js";
import "dotenv/config";

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds
    ]
});

client.login(process.env.TOKEN);