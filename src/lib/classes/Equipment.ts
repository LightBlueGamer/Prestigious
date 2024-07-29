import type { Cuirass } from "./Cuirass.js";
import type { Helmet } from "./Helmet.js";
import type { LegArmor } from "./LegArmor.js";
import type { Shield } from "./Shield.js";
import type { Weapon } from "./Weapon.js";

/**
 * Represents a character's equipment.
 */
export class Equipment {
    weapon: Weapon | null;
    shield: Shield | null;
    helmet: Helmet | null;
    cuirass: Cuirass | null;
    legArmor: LegArmor | null;

    /**
     * Constructs a new instance of Equipment.
     *
     * @param weapon - The weapon the character is using.
     * @param shield - The shield the character is using.
     * @param helmet - The helmet the character is wearing.
     * @param cuirass - The cuirass the character is wearing.
     * @param legArmor - The leg armor the character is wearing.
     */
    constructor(
        weapon: Weapon | null = null,
        shield: Shield | null = null,
        helmet: Helmet | null = null,
        cuirass: Cuirass | null = null,
        legArmor: LegArmor | null = null
    ) {
        this.weapon = weapon;
        this.shield = shield;
        this.helmet = helmet;
        this.cuirass = cuirass;
        this.legArmor = legArmor;
    }
}
