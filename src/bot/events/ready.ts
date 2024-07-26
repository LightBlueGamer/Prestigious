import { Client, ActivityType } from "discord.js";
import * as fs from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

export default {
    name: "ready",
    once: true,
    async execute(client: Client) {
        if (!client.user) return console.error(`No client user was found.`);
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = dirname(__filename);
        const packageJsonPath = join(__dirname, "../../..", "package.json");
        const data = fs.readFileSync(packageJsonPath, "utf-8");
        const packageJson: PackageJson = JSON.parse(data);
        setTimeout(() => {
            client.user?.setPresence({
                status: "online",
                activities: [
                    {
                        name: `CustomStatus`,
                        type: ActivityType.Custom,
                        state: `Prestigious V${packageJson.version} - Adventuring in ${client.guilds.cache.size} servers with ${client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)} players!`,
                    },
                ],
            });
        }, 5000);
        console.log(`Bot is running as ${client.user.username}.`);
    },
};
