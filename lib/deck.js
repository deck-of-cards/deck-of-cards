import { Pile } from './pile.js';
import { Card } from './card.js';
import { standardDeck } from './standard-deck.js';

export class Deck extends Pile {
  constructor (options = {}) {
    const { graphics = standardDeck } = options;

    super({
      ...options,
      graphics
    });

    this.cards = graphics.front.map((card, i) => new Card({
      graphics,
      pile: this,
      i: 53 - i,
      x: 0,
      y: 0,
      z: i
    }));
  }

  move (card) {
    const intersectingCards = this.cards
      .filter(card2 => card2 !== card)
      .filter(card2 => this.intersecting(card, card2));

    if (!intersectingCards.length) {
      this.remove(card);
    }
  }

  moveBack (card) {
    card.x = 0;
    card.y = 0;
  }

  push (card) {
    super.push(card);
    card.x = 0;
    card.y = 0;
  }
}
