import { cards } from '../misc/cards';
export class BlackJack {
    player: BlackJack.Player;
    house: BlackJack.House;
    deck: BlackJack.Deck;
    constructor(player: BlackJack.Player = new BlackJack.Player(), house: BlackJack.House = new BlackJack.House(), deck: BlackJack.Deck = cards.map(card => ({name: card.name, icon: card.icon, value: card.value}))) {
        this.player = player;
        this.house = house;
        this.deck = deck;
    }

    shuffle() {
        return this.deck = this.deck.sort(() => Math.random() - 0.5);
    }

    nextCard(hand: BlackJack.Hand) {
        const card =  this.deck.shift()!;
        if(card.value === 11 && this.getValue(hand) + card.value > 21) card.value = 1;
        return card;
    }

    deal() {
        this.player.hand.push(this.nextCard(this.player.hand));
        this.house.hand.push(this.nextCard(this.house.hand));
        this.player.hand.push(this.nextCard(this.player.hand));
        this.house.hand.push(this.nextCard(this.house.hand));
        return {
            playerHand: this.player.hand, 
            houseHand: this.house.hand
        };
    }

    getValue(hand: BlackJack.Hand) {
        return hand.reduce((acc, card) => acc + card.value, 0);
    }

    hasBlackJack(hand: BlackJack.Hand) {
        return this.getValue(hand) === 21;
    }

    hasBust(hand: BlackJack.Hand) {
        return this.getValue(hand) > 21;
    }
    
    hit(hand: BlackJack.Hand) {
        hand.push(this.nextCard(hand));
        return hand;
    }

}

export namespace BlackJack {
    export class Player {
        hand: BlackJack.Hand;
        constructor(hand: BlackJack.Hand = []) {
            this.hand = hand;
        }
    }

    export class House {
        hand: BlackJack.Hand;
        constructor(hand: BlackJack.Hand = []) {
            this.hand = hand;
        }
    }

    export type Card = {
        name: string;
        icon: string;
        value: number;
    }

    export type Deck = Card[];
    export type Hand = Card[];
}