import express from 'express';
import Topgg from "@top-gg/sdk";
import { Player } from "../lib/structures/Player";
import { appendFileSync } from "fs";
import { resolve } from "path";

const webhook = new Topgg.Webhook(process.env.GGAUTH);
const app: express.Application = express();

app.use(express.static("./public"));

app.get("/", (_req, res) => res.sendFile('public/index.html', { root: '.' }));
app.get("/lb", (_req, res) => res.sendFile('public/leaderboard.html', { root: '.' }));
app.get("/user", (_req, res) => res.sendFile('public/user.html', { root: '.' }));

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

import "dotenv/config";

const port = process.env.DASHBOARD_PORT || 3000;

app.listen(port, () => console.log(`Dashboard running on port ${port}`));