import { Client, ActivityType } from "discord.js";
import {
    getPackageJSONData,
    setupGracefulShutdown,
} from "../../lib/library.js";
import { writeFileSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    name: "ready",
    once: true,
    async execute(client: Client) {
        if (!client.user) return console.error(`No client user was found.`);
        await import("../../lib/resources/autoCompletes.js");
        const { version } = getPackageJSONData();

        if (getStartJSON().rewrite) {
            const date: StartJson = {
                time: client.readyAt!.getTime(),
                rewrite: false,
            };

            writeFileSync(
                join(__dirname, "../startDate.json"),
                JSON.stringify(date)
            );
        }

        setInterval(() => {
            client.user?.setPresence({
                status: "online",
                activities: [
                    {
                        name: `CustomStatus`,
                        type: ActivityType.Custom,
                        state: `Prestigious V${version} - Adventuring in ${client.guilds.cache.size} servers with ${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)} players!`,
                    },
                ],
            });
        }, 1000 * 15);
        setupGracefulShutdown(client);
        console.log(`Bot is running as ${client.user.username}.`);
    },
};

function getStartJSON(): StartJson {
    const packageJsonPath = join(__dirname, "../startDate.json");
    try {
        const data = readFileSync(packageJsonPath, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === "ENOENT") {
            return { time: Date.now(), rewrite: true };
        } else {
            throw error;
        }
    }
}
