import { Pile } from './pile.js';
import { Card } from './card.js';
import { standardDeck } from './standard-deck.js';
import { shuffle } from './shuffle.js';
import { animate } from './animate.js';

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

  shuffle () {
    shuffle(this.cards);
    this.cards.forEach((card, i) => {
      card.z = i;
    });
    this.game.pile();
  }

  moveBack (card) {
    animate(card, 200, { x: 0, y: 0 });
  }

  push (card) {
    card.pile = this;
    card.x = card.x - this.x;
    card.y = card.y - this.y;

    animate(card, 200, {
      x: 0,
      y: 0
    });

    this.cards.push(card);
    card.z = this.cards.length;
  }
}
