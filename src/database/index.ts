import Josh from "@joshdb/core";
import provider from "@joshdb/mongo";
import type { Player } from "../lib/classes/Player";
import "dotenv/config";

export const globalEcon = new Josh<Player.JSON>({
    name: "globalEcon",
    provider,
    providerOptions: {
        collection: 'globalEcon',
        url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@prestigious.lsmxfmv.mongodb.net/defaultauthdb`
    }
});

export const econ = new Josh<Player.JSON>({
    name: "econ",
    provider,
    providerOptions: {
        collection: 'econ',
        url: `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@prestigious.lsmxfmv.mongodb.net/defaultauthdb`
    }
});