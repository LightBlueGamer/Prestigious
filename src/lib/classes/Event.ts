export class Event {
    name: Event.Name;
    once: Event.Once;
    execute: Event.Execute;
    constructor(
        name: Event.Name,
        once: Event.Once,
        execute: Event.Execute,
    ) {
        this.name = name;
        this.once = once;
        this.execute = execute;
    }
}

export namespace Event {
    export type Name = string;
    export type Once = Boolean;
    export type Execute = (...args: any) => void;
}