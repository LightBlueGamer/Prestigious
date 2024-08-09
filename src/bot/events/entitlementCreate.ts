import { type Entitlement } from "discord.js";
import { items, Player } from "../../lib/library.js";

export default {
    name: "entitlementCreate",
    once: false,
    async execute(entitlement: Entitlement) {
        const { skuId, client, userId } = entitlement;
        const player = await Player.get(userId, client);
        if (skuId === "1268382692685119649") {
            //Premium
            player.setPremium(true).save();
        }
        if (skuId === "1271292173714849792") {
            //Lootboxes
            const lootbox = Object.values(items).find(
                (i) => i.name.toLowerCase() === "lootbox"
            )!;
            await entitlement.consume();
            player.addItemExcess(lootbox, 5);
        }
    },
};
