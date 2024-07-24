import Josh from "@joshdb/core";
import provider from "@joshdb/mongo";
import "dotenv/config";
import type { Player } from "../lib/game/Player.js";

const uri = `mongodb+srv://Laptop:${process.env.MONGO_PASSWORD}@cluster0.bjnb7xh.mongodb.net/`;

export const db = new Josh<Player.JSON>({
    name: "Prestigious",
    provider,
    providerOptions: {
        collection: "Prestigious",
        url: uri,
    },
});

export async function startDB() {}
