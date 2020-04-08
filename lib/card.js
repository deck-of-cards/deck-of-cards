import { standardDeck } from './standard-deck.js';

export class Card {
  constructor (options = {}) {
    const { i = 0, x = 0, y = 0, z = 0, graphics = standardDeck, deck } = options;

    this.i = i;
    this._x = x;
    this._y = y;
    this._z = z;
    this.graphics = graphics;
    this.deck = deck;
  }

  get width () {
    return this.graphics.width;
  }

  get height () {
    return this.graphics.height;
  }

  get x () {
    const { _x, deck = {} } = this;

    return _x + (deck.x || 0);
  }

  get y () {
    const { _y, deck = {} } = this;

    return _y + (deck.y || 0);
  }

  get z () {
    const { _z, deck = {} } = this;

    return _z + (deck.z || 0);
  }
}
