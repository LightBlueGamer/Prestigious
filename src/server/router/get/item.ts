import express from "express";
import { items } from "../../../lib/resources/items.js";

const item = express.Router();

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
