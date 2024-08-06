import express from "express";
import "dotenv/config";
import { router } from "./router/router.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.API_PORT || 3333;

const assetFiles = readdirSync(join(__dirname, "../../public/assets"));

app.use("/api", router);
app.use(express.static(join(__dirname, "../../public")));
app.use("/docs", express.static(join(__dirname, "../../docs")));

app.get(`/wiki`, (_req, res) => {
    res.sendFile(join(__dirname, "../../public/index.html"));
});

app.get(`/wiki/item`, (_req, res) => {
    res.sendFile(join(__dirname, "../../public/item.html"));
});

app.get("/docs", (_req, res) => {
    res.sendFile(join(__dirname, "../../docs/index.html"));
});

for (const asset of assetFiles) {
    app.get(`/assets/${asset}`, (_req, res) => {
        res.sendFile(join(__dirname, "../../public/assets", asset));
    });
}

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
