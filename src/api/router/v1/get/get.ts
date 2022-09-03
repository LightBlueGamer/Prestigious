import express from "express";
const get = express.Router();

import { leaderboard } from './leaderboard';
import { player } from './player';
import { inventory } from './inventory';

get.use('/get', leaderboard);
get.use('/get', player);
get.use('/get', inventory);
get.get('/status', (_req, res) => res.status(200).sendStatus(200));

export { get };