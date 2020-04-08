import { standardDeck } from './standard-deck.js';
import { Card } from './card.js';

export class Deck {
  constructor (options = {}) {
    const { x = 0, y = 0, z = 0, graphics = standardDeck } = options;

    this.x = x;
    this.y = y;
    this.z = z;
    this.graphics = graphics;

    this.cards = graphics.front.map((card, i) => new Card({
      graphics,
      deck: this,
      i: 53 - i,
      x: 0,
      y: 0,
      z: i
    }));
  }
}
