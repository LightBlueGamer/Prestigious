import express from "express";
import { playerdata } from "./playerdata.js";

const get = express.Router();

get.use("/get", playerdata);

export { get };
