import { Pile } from './pile.js';
import { Card } from './card.js';

export class Deck extends Pile {
  constructor (options = {}) {
    const {
      x = 0,
      y = 0,
      style = 'standard',
      parent
    } = options;

    super({
      type: 'Deck',
      parent,
      style,
      x,
      y
    });

    this.children = [];

    if (parent) {
      parent.add(this);
    }
  }

  createCards () {
    this.trigger('createCards', { Card });
  }
}
