import { type Entitlement } from "discord.js";
import { Player } from "../../lib/library.js";

export default {
    name: "entitlementCreate",
    once: false,
    async execute(entitlement: Entitlement) {
        const { skuId, client, userId } = entitlement;
        if (skuId === "1268382692685119649") {
            const player = await Player.get(userId, client);
            player.setPremium(true).save();
        }
    },
};
