import express from "express";
const router = express.Router();

import { get } from "./get/get.js";

router.use("/v1", get);

export { router };
