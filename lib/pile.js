import { Entity } from './entity.js';
import { Card } from './card.js';

export class Pile extends Entity {
  constructor (options = {}) {
    const {
      x = 0,
      y = 0,
      style = 'standard',
      parent,
      type = 'Pile'
    } = options;

    super({
      type,
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

  intersecting (card) {
    for (let i = 0; i < this.children.length; i++) {
      const card2 = this.children[i];

      if (card === card2) {
        continue;
      }

      if (card.intersecting(card2)) {
        return true;
      }
    }

    return false;
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
      card.trigger('remove');
      card.parent = null;
    }
  }
}
