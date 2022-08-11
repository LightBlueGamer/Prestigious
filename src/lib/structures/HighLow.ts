import { cards } from "../misc/cards";

export class HighLow {
    deck: HighLow.Deck;
    constructor(deck: HighLow.Deck = cards.map(card => ({name: card.name, icon: card.icon, value: card.value}))) {
        this.deck = deck;
    }

    shuffle() {
        return this.deck = this.deck.sort(() => Math.random() - 0.5);
    }

    nextCard() {
        const card =  this.deck.shift()!;
        if(card.name.includes('jack')) card.value = 11;
        if(card.name.includes('queen')) card.value = 12;
        if(card.name.includes('king')) card.value = 13;
        if(card.name.includes('ace')) card.value = 1;
        return card;
    }
}

export namespace HighLow {
    export type Card = {
        name: string;
        icon: string;
        value: number;
    }

    export type Deck = Card[];
}