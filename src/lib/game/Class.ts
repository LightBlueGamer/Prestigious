export class Class {
    name: string;
    attributes: string[];
    proficiencies: string[];
    experience: number;
    constructor(
        name: string,
        attributes: string[],
        proficiencies: string[],
        experience: number = 0
    ) {
        this.name = name;
        this.attributes = attributes;
        this.proficiencies = proficiencies;
        this.experience = experience;
    }
}
