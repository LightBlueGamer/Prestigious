import express from "express";
import { db } from "../../../db/index.js";

const playerdata = express.Router();

/**
 * GET /playerdata/:userId
 *
 * Retrieves player data for the specified user ID.
 *
 * @param req - The Express request object containing the route parameter.
 * @param req.params.userId - The ID of the user whose data is being requested.
 * @param res - The Express response object used to return data or errors.
 *
 * @returns {void} The route handler returns a JSON response.
 *
 * @example
 * // Example request: GET /playerdata/12345
 * // Example response:
 * // {
 * //   "id": "12345",
 * //   "name": "PlayerName",
 * //   "balance": 1000,
 * //   "level": 5,
 * //   ...
 * // }
 *
 * @error {404} Not Found - User not found.
 * @error {500} Internal Server Error - Unexpected error occurred.
 */
playerdata.get("/playerdata/:userId", async (req, res) => {
    const userId = req.params.userId;
    try {
        const data = await db.get(userId);
        if (!data) {
            res.status(404).json({ error: "User not found" });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export { playerdata };
