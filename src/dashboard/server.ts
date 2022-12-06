import express from 'express';

const app: express.Application = express();

app.use(express.static("./public"));

app.get("/", (_req, res) => res.sendFile('public/index.html', { root: '.' }));
app.get("/lb", (_req, res) => res.sendFile('public/leaderboard.html', { root: '.' }));
app.get("/user", (_req, res) => res.sendFile('public/user.html', { root: '.' }));

import "dotenv/config";

const port = process.env.DASHBOARD_PORT || 3000;

app.listen(port, () => console.log(`Dashboard running on port ${port}`));