import express from "express";
import sortArray from "sort-array";
const inventory = express.Router();
import { Player } from "../../../../lib/structures/Player";

inventory.get('/inventory', async (req, res) => {
    if(!req.query.id) return res.status(400).sendStatus(400)
    const id = req.query.id?.toString();
    const user = await Player.get(id!);
    if(!user) return res.status(404).sendStatus(404);
    const items = user.inventory
    const sorted = sortArray(items, {
        by: 'comp',
        order: 'rarity',
        customOrders: {
            rarity: ['Unique', 'Artifact', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common']
        },
        computed: {
            comp: (row) => row.rarity.name,
        },
    })
    return res.status(200).send(sorted);
});

export { inventory }