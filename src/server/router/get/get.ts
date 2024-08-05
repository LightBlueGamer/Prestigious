import express from "express";
import { playerdata } from "./playerdata.js";
import { items } from "./items.js";
import { item } from "./item.js";
import { pity } from "./pity.js";

const get = express.Router();

get.use("/get", playerdata);
get.use("/get", items);
get.use("/get", item);
get.use("/get", pity);

export { get };
