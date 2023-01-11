export class Card {
    name: string;
    value: number;
    icon: string;
    constructor(
        name: string,
        value: number,
        icon: string,
    ) {
        this.name = name;
        this.value = value;
        this.icon = icon;
    }
}