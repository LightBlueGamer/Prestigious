import {
    Client,
    codeBlock,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import { Modules } from "../../lib/library.js";

export default {
    devMode: true,
    module: Modules.Misc,
    data: {
        name: "eval",
        type: 3,
    },
    async execute(interaction: MessageContextMenuCommandInteraction) {
        await interaction.deferReply({
            ephemeral: true,
        });
        if (interaction.user.id !== "232466273479426049")
            return interaction.editReply(
                "You do not have permission to use this command."
            );
        async function clean(client: Client<boolean>, text: string) {
            if (text && text.constructor.name === "Promise") text = await text;
            if (typeof text !== "string")
                text = (await import("util")).inspect(text, { depth: 1 });

            text = text
                .replace(/`/g, `\`${String.fromCharCode(8203)}`)
                .replace(/@/g, `@${String.fromCharCode(8203)}`)
                .replace(client.token!, "||[REDACTED]||");

            return text;
        }

        function cleanInput(ctn: string) {
            let content = ctn;
            const regex = /^```(?:js|javascript|ts|typescript)\n([\s\S]*?)```$/;
            const input = regex.test(content);
            if (input) content = content?.match(regex)?.[1]!;
            else if (content.startsWith("```") && content.endsWith("```")) {
                let ctnArr = content.split("```");
                ctnArr.shift();
                ctnArr.pop();
                content = ctnArr.join(" ");
            }

            return content;
        }

        const message = interaction?.channel?.messages.resolve(
            interaction.targetId
        );
        if (!message) return;
        const code = cleanInput(message.content);
        try {
            const evaled = eval(`(async()=>{${code}})()`);
            const cleaned = await clean(interaction.client, evaled);
            const MAX_CHARS = 3 + 2 + cleaned.length + 3;
            if (MAX_CHARS > 4000) {
                await interaction.editReply({
                    content:
                        "Output exceeded 4000 characters. Sending as a file.",
                    files: [
                        {
                            attachment: Buffer.from(cleaned),
                            name: "output.txt",
                        },
                    ],
                });
            }

            return await interaction.editReply(codeBlock("js", cleaned));
        } catch (err) {
            return console.log(err);
        }
    },
};
