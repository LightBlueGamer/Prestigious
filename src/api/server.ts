import Topgg from "@top-gg/sdk";
import express from "express";
const app = express();
import "dotenv/config";
import { Player } from "../lib/structures/Player";
const webhook = new Topgg.Webhook(process.env.GGAUTH);
import { appendFileSync } from "fs";
import { resolve } from "path";

app.post("/dblwebhook", webhook.listener(async (vote) => {
    try {
        const player = await Player.get(vote.user);
        player.vote()
        console.log(`${player.tag} has voted!`);
        appendFileSync(resolve('logs.txt'), `${player.tag} has voted!\n`);
        player.save();
    } catch (error) {
        console.error(error)
    }
}));

const port = process.env.PORT || 9000

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});