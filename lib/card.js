import { standardDeck } from '../../standard-deck/dist/deck.js';
import { cardIntersecting } from './card-intersecting.js';

export class Card {
  constructor (options = {}) {
    const { i = 0, x = 0, y = 0, z = 0, graphics = standardDeck, pile } = options;

    this.i = i;
    this.x = x;
    this.y = y;
    this.z = z;
    this.graphics = graphics;
    this.pile = pile;
  }

  intersecting (anotherCard) {
    return cardIntersecting(this, anotherCard);
  }

  get width () {
    return this.graphics.width;
  }

  get height () {
    return this.graphics.height;
  }
}
