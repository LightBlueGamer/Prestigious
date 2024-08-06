import Josh from "@joshdb/core";
import provider from "@joshdb/mongo";
import "dotenv/config";
import type { Player } from "../lib/classes/Player.js";

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}`;

export const db = new Josh<Player.JSON>({
    name: "Prestigious",
    provider,
    providerOptions: {
        collection: `${process.env.MONGO_COLLECTION}`,
        url: uri,
    },
});
