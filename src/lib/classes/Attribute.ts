/**
 * Represents an attribute with a name and a numeric value.
 * 
 * @example
 * ```typescript
 * const attribute = new Attribute('strength', 10);
 * console.log(attribute.name); // Output: strength
 * console.log(attribute.value); // Output: 10
 * ```
 */
export class Attribute {
    /**
     * The name of the attribute.
     */
    name: string;

    /**
     * The numeric value of the attribute.
     */
    value: number;

    /**
     * Constructs a new instance of the Attribute class.
     *
     * @param name - The name of the attribute.
     * @param value - The numeric value of the attribute.
     */
    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
}
