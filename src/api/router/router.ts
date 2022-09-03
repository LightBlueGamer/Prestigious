import express from "express";
const router = express.Router();

import { get } from './v1/get/get';

router.use('/v1', get);

export { router };