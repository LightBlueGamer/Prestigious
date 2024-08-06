import express from "express";
import { items as cItems } from "../../../lib/resources/items.js";

const items = express.Router();

/**
 * GET /items
 *
 * Fetches a list of all available items.
 *
 * @param _req - The Express request object. This parameter is not used in the handler.
 * @param res - The Express response object used to return data or errors.
 *
 * @returns {void} The route handler returns a JSON response.
 *
 * @example
 * // Example request: GET /items
 * // Example response:
 * // [
 * //   { "name": "Sword", "description": "A sharp blade.", ... },
 * //   { "name": "Shield", "description": "Protects the user.", ... },
 * //   ...
 * // ]
 *
 * @error {404} Not Found - Items not found.
 * @error {500} Internal Server Error - Unexpected error occurred.
 */
items.get("/items", async (_req, res) => {
    try {
        const data = Object.values(cItems);
        if (!data) {
            res.status(404).json({ error: "Items not found" });
        } else {
            res.status(200).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export { items };
