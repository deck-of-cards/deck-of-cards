import { Group } from './group.js';
import { Card } from './card.js';
import { animate } from './animate.js';

export class Deck extends Group {
  constructor (options = {}) {
    super({
      ...options,
      type: 'Deck'
    });
  }

  createCards (count, options) {
    for (let i = 0; i < count; i++) {
      const card = new Card({
        ...options,
        i: count - i - 1,
        x: -i / 4,
        y: -i / 4
      });
      this.add(card);
    }

    return this;
  }

  moveBack () {
    for (let i = 0; i < this.children.length; i++) {
      animate(this.children[i], 200, {
        x: -i / 4,
        y: -i / 4
      });
    }
  }
}
