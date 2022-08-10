import express from "express";
const app = express();
import { dirname } from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname + "/public"));

app.get("/", (_req: any, res: { sendFile: () => any; }) => {
    return res.sendFile();
});


const port = 4545;
app.listen(port);
console.log(`Listening in: http://135.125.188.15:${port}`);