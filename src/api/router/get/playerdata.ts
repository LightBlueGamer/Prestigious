import express from "express";
import { db } from "../../../db/index.js";

const playerdata = express.Router();

/**
 * Retrieves player data from the database based on the provided user ID.
 *
 * @remarks
 * This function is an Express route handler that handles GET requests to the "/playerdata/:userId" endpoint.
 * It retrieves the user ID from the request parameters, fetches the corresponding player data from the database,
 * and sends the data as a JSON response with a status code of 200.
 *
 * @param {import("express").Request} req - The Express request object containing the user ID in the request parameters.
 * @param {import("express").Response} res - The Express response object to send the JSON response.
 *
 * @returns {Promise<void>} - A Promise that resolves when the response is sent.
 */
playerdata.get("/playerdata/:userId", async (req, res) => {
    const userId = req.params.userId;
    const data = await db.get(userId);
    res.status(200).json(data);
});

export { playerdata };
