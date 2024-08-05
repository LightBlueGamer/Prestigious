import express from "express";
import { calculateItemPityChance, Player } from "../../../lib/library.js";

const pity = express.Router();

pity.get("/pity", async (req, res) => {
    try {
        const itemName = req.query.item;
        const user = req.query.user;

        if (!itemName) {
            return res
                .status(400)
                .json({ error: "Item parameter is required" });
        }

        if (!user) {
            return res
                .status(400)
                .json({ error: "User parameter is required" });
        }

        const player = await Player.getFromID(user.toString());

        const pity =
            calculateItemPityChance(itemName.toString(), player.pities) || 0;

        return res.status(200).json({ pity });
    } catch (error) {
        console.error("Error fetching item:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export { pity };
