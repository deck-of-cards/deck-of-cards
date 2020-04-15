import { Entity } from './entity.js';
import { Card } from './card.js';

export class Deck extends Entity {
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

  add (card) {
    if (card.parent) {
      card.parent.remove(card);
    }

    card.parent = this;

    this.children.push(card);
    card.trigger('add');
    return this;
  }

  remove (card) {
    const index = this.children.indexOf(card);

    if (~index) {
      this.children.splice(index, 1);
      card.parent = null;
      card.trigger('remove');
    }
  }
}
