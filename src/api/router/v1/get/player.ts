import express from "express";
const player = express.Router();
import { Player } from "../../../../lib/structures/Player";

player.get('/player', async (req, res) => {
    if(!req.query.id) return res.status(400).sendStatus(400)
    const id = req.query.id?.toString();
    const user = await Player.get(id!);
    if(!user) return res.status(404).sendStatus(404)
    return res.status(200).send(user);
});

export { player }