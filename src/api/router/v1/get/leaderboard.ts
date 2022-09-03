import express from "express";
const leaderboard = express.Router();
import { players } from '../../../../database/main'
import { Player } from "../../../../lib/structures/Player";

leaderboard.get('/leaderboard', async (_req, res) => {
    const playerList: Player[] = [];
    
    for(const key of (await players.keys)) {
        playerList.push(Player.fromJSON(await players.get(key)));
    }
    res.send(playerList.sort((a, b) => b.prestige - a.prestige || b.level - a.level || b.xp - a.xp || b.coins - a.coins));
});

export { leaderboard }