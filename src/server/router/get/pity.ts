import express from "express";
import { calculateItemPityChance, Player } from "../../../lib/library.js";

const pity = express.Router();

/**
 * GET /pity
 *
 * Calculates and returns the pity value for a specific item for a given user.
 *
 * @param req - The Express request object containing query parameters.
 * @param req.query.item - The name of the item to check pity for.
 * @param req.query.user - The ID of the user to check pity against.
 * @param res - The Express response object used to return data or errors.
 *
 * @returns {void} The route handler returns a JSON response.
 *
 * @example
 * // Example request: GET /pity?item=sword&user=12345
 * // Example response:
 * // { "pity": 10 }
 *
 * @error {400} Bad Request - Item or user parameter is required.
 * @error {500} Internal Server Error - Unexpected error occurred.
 */
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
            calculateItemPityChance(itemName.toString(), player.pity) || 0;

        return res.status(200).json({ pity });
    } catch (error) {
        console.error("Error fetching item:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export { pity };
