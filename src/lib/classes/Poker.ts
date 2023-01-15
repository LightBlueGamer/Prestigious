import { pokerhandArray } from "../../utils/functions";
import type { Card } from "./Card";
import pokerhand from "pokerhandrank";

export class Poker {
    players: Poker.Players;
    cards: Card[];
    turn: number;
    communityCards: Card[];
    playersRemaining: number;
    burn: Card[];
    pot: number;
    constructor(
        players: Poker.Players,
        cards: Card[],
    ) {
        this.players = players;
        this.cards = cards;
        this.turn = 3;
        this.communityCards = [];
        this.playersRemaining = 6;
        this.burn = [];
        this.pot = 0;
    }

    shuffle() {
        this.cards = this.cards.sort(() => Math.random() - 0.5);
        return this;
    }

    nextCard() {
        const card = this.cards.shift()!;
        return card;
    }

    init(buyIn: number) {
        for (let i = 0; i < this.playersRemaining; i++) {
            this.players.push({
                position: i,
                hand: [],
                bet: 0,
                balance: buyIn,
                smallBlind: i === 0,
                bigBlind: i === 1,
                skip: false,
                value: 0
            });
        }
    }

    deal() {
        for (let i = 0; i < 2; i++) {
            for (const player of this.players) {
                player.hand.push(this.nextCard());
            }
        }
    }

    call(player: Poker.Player) {
        const curBet = this.players.reduce(function (a, b) {
            return Math.max(a, b.bet);
        }, -Infinity);

        player.bet += curBet;
        player.balance -= curBet;

        return this.nextTurn();
    }

    fold(player: Poker.Player) {
        player.skip = true;
        return this.nextTurn();
    }

    check() {
        return this.nextTurn();
    }

    raise(player: Poker.Player, raise: number) {
        if (raise >= player.balance) return this.allIn(player);
        player.bet += raise;
        player.balance -= raise;
        return this.nextTurn();

    }

    allIn(player: Poker.Player) {
        player.bet += player.balance;
        player.balance -= player.balance;
        player.skip = true;
        return this.nextTurn();
    }

    flop() {
        this.burn.push(this.nextCard());
        for (let i = 0; i < 3; i++) this.communityCards.push(this.nextCard());
        for (const player of this.players) {
            this.pot += player.bet;
            player.bet = 0;
        }
    }

    riverTurn() {
        this.burn.push(this.nextCard());
        this.communityCards.push(this.nextCard());
        for (const player of this.players) {
            this.pot += player.bet;
            player.bet = 0;
        }
    }

    showdown() {
        const players = Array.from(this.players.filter(p => !p.skip));
        const table = pokerhandArray(this.communityCards.map(card => card.icon).join(' '))

        while (players.length > 1) {
            const p1 = pokerhandArray(players[0].hand.map(card => card.icon).join(' ')).push(...table);
            const p2 = pokerhandArray(players[1].hand.map(card => card.icon).join(' ')).push(...table);
            pokerhand.checkRank()
        }
    }

    nextTurn(): this {
        if (this.turn === this.playersRemaining) {
            this.turn = 0;
            if (this.communityCards.length === 0) this.flop();
            else if (this.communityCards.length === 3 || this.communityCards.length === 4) this.riverTurn();
        }
        else this.turn++;
        if (this.players.find(p => p.position === this.turn)?.skip) return this.nextTurn();
        else return this;
    }
}

export namespace Poker {
    export interface Player {
        position: number;
        hand: Poker.Hand;
        bet: number;
        balance: number;
        bigBlind: boolean;
        smallBlind: boolean;
        skip: boolean;
        value: number;
    }
    export type Hand = Card[];
    export type Players = Poker.Player[];
}