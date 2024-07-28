import express from "express";
import { db } from "../../../db/index.js";

const playerdata = express.Router();

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
