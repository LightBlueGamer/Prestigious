import { cards } from "../misc/cards.js";
import type { Card } from "./Card.js";

export class Deck {
    cards: Card[];
    constructor(
        cards: Card[]
    ) {
        this.cards = cards;
    }

    shuffle() {
        this.cards = this.cards.sort(() => Math.random() - 0.5);
        return this;
    }

    blackJackNextCard(hand: Deck.Hand) {
        const card = this.cards.shift()!;
        if(card.value === 11) (this.getValue(hand) + card.value) > 21 ? card.value = 1 : 11;
        return card;
    }

    getValue(hand: Deck.Hand) {
        return hand.reduce((acc, card) => acc + card.value, 0);
    }

    hit(hand: Deck.Hand) {
        hand.push(this.blackJackNextCard(hand));
        return hand;
    }

    isBust(hand: Deck.Hand) {
        return this.getValue(hand) >= 22;
    }
    
    hasBlackJack(hand: Deck.Hand) {
        return this.getValue(hand) === 21;
    }

    static init(size: number) {
        const deck: Card[] = [];
        for(let i = 0; i < size; i++) {
            cards.map(card => deck.push(card));
        };
        return new Deck(deck).shuffle();
    }
}

export namespace Deck {
    export type Hand = Card[];
}