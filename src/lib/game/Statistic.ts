/**
 * Represents a single statistic with a name and an amount.
 *
 * @class Statistic
 * @constructor
 * @param {string} name - The name of the statistic.
 * @param {number} amount - The amount associated with the statistic.
 */
export class Statistic {
    name: string;
    amount: number;
    constructor(name: string, amount: number) {
        this.name = name;
        this.amount = amount;
    }
}
