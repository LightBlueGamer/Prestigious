import express from "express";
import { items } from "../../../lib/resources/items.js";

const item = express.Router();

/**
 * GET /item
 *
 * Fetches information about a specific item from the items collection based on the provided item name.
 *
 * @param req - The Express request object containing query parameters.
 * @param req.query.item - The name of the item to fetch.
 * @param res - The Express response object used to return data or errors.
 *
 * @returns {void} The route handler returns a JSON response.
 *
 * @example
 * // Example request: GET /item?item=sword
 * // Example response:
 * // {
 * //   "name": "Sword",
 * //   "description": "A sharp blade for cutting.",
 * //   "damage": 15,
 * //   "weight": 3,
 * //   "value": 100
 * // }
 *
 * @error {400} Bad Request - Item parameter is required.
 * @error {404} Not Found - Item not found.
 * @error {500} Internal Server Error - Unexpected error occurred.
 */
item.get("/item", async (req, res) => {
    try {
        const itemName = req.query.item;

        if (!itemName) {
            return res
                .status(400)
                .json({ error: "Item parameter is required" });
        }

        const foundItem = Object.values(items).find(
            (item) =>
                item.name.toLowerCase() === itemName.toString().toLowerCase()
        );

        if (foundItem) {
            return res.status(200).json(foundItem);
        } else {
            return res.status(404).json({ error: "Item not found" });
        }
    } catch (error) {
        console.error("Error fetching item:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

export { item };
