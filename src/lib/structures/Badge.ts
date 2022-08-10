export class Badge {
    name: string;
    description: string;
    icon: string;
    priority: number;
    constructor(name: string, description: string, icon: string, priority: number) {
        this.name = name;
        this.description = description;
        this.icon = icon;
        this.priority = priority;
    }
}