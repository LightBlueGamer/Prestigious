export class Reward {
    name;
    description;
    rarity;
    weight;
    type;
    constructor(
        name, 
        description, 
        rarity, 
        weight, 
        type
    ) {
        this.name = name;
        this.description = description;
        this.rarity = rarity;
        this.weight = weight;
        this.type = type;
    }
}