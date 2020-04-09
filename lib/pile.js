import { intersecting } from './intersecting.js';
import { animate } from './animate.js';

export class Pile {
  constructor (options = {}) {
    const { x = 0, y = 0, z = 0 } = options;

    this.x = x;
    this.y = y;
    this.z = z;

    this.cards = [];
  }

  intersecting (card, card2) {
    return intersecting(card, card2);
  }

  moveBack (card) {
    const cardIndex = this.cards.indexOf(card);
    if (this.vertical) {
      animate(card, 200, { x: 0, y: cardIndex * 30 });
    } else {
      animate(card, 200, { x: cardIndex * 15, y: 0 });
    }
  }

  push (card) {
    card.pile = this;
    card.x = card.x - this.x;
    card.y = card.y - this.y;

    this.cards.push(card);
    this.moveBack(card);
    card.z = this.cards.length;
  }

  move (card) {
    const intersectingCards = this.cards
      .filter(card2 => card2 !== card)
      .filter(card2 => this.intersecting(card, card2));

    if (!intersectingCards.length) {
      this.remove(card);
    }
  }

  remove (card) {
    let removed = false;
    for (let i = 0; i < this.cards.length; i++) {
      const card2 = this.cards[i];

      if (card === card2) {
        card.pile = null;
        card.x += this.x;
        card.y += this.y;
        animate(card, 150, { z: 0 });
        this.cards.splice(i--, 1);
        removed = true;
      } else if (removed) {
        this.moveBack(card2);
        card2.z--;
      }
    }
  }
}
