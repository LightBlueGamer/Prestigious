import Josh from "@joshdb/core";
import provider from "@joshdb/mongo";
import type { Player } from "../lib/classes/Player.js";
import "dotenv/config";

export const economy = new Josh<Player.JSON>({
    name: "econ",
    provider,
    providerOptions: {
        collection: 'econ',
        url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@prestigious.lsmxfmv.mongodb.net/defaultauthdb`
    }
});