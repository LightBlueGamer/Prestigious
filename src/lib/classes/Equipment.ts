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

    /**
     * Custom iterator for the Equipment class that allows iterating over the character's equipment items.
     *
     * @returns {Iterator<Weapon | Shield | Helmet | Cuirass | LegArmor | null>} An iterator yielding each piece of equipment in the order: weapon, shield, helmet, cuirass, leg armor.
     *
     * @example
     * for (const item of character.equipment) {
     *     if (item instanceof Weapon) {
     *         console.log(`Character is wielding a ${item.name}`);
     *     } else if (item instanceof Shield) {
     *         console.log(`Character is using a ${item.name} shield`);
     *     } else if (item instanceof Helmet) {
     *         console.log(`Character is wearing a ${item.name} helmet`);
     *     } else if (item instanceof Cuirass) {
     *         console.log(`Character is wearing a ${item.name} cuirass`);
     *     } else if (item instanceof LegArmor) {
     *         console.log(`Character is wearing ${item.name} leg armor`);
     *     } else {
     *         console.log('Character has no equipment in this slot');
     *     }
     * }
     */
    *[Symbol.iterator](): Iterator<
        Weapon | Shield | Helmet | Cuirass | LegArmor | null
    > {
        yield this.weapon;
        yield this.shield;
        yield this.helmet;
        yield this.cuirass;
        yield this.legArmor;
    }
}
