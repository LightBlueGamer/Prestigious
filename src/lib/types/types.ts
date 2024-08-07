import type { Cuirass } from "../classes/Cuirass.js";
import type { DurableBackpackItem } from "../classes/DurableBackpackItem.js";
import type { Helmet } from "../classes/Helmet.js";
import type { LegArmor } from "../classes/LegArmor.js";
import type { Shield } from "../classes/Shield.js";
import type { BackpackItem } from "../library.js";

export type ArmorItemType = Helmet | Cuirass | LegArmor | Shield;
export type BackpackItemType = BackpackItem | DurableBackpackItem;
