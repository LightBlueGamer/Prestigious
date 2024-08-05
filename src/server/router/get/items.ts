import express from "express";
import { items as cItems } from "../../../lib/resources/items.js";

const items = express.Router();

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
