import express from "express";
import "dotenv/config";
import { router } from "./router/router.js";

const app = express();

app.use("/api", router);

const port = process.env.API_PORT || 3333;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
