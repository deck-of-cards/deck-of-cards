import { intersecting } from './intersecting.js';

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

  moveBack (card) {}

  push (card) {
    card.pile = this;
    this.cards.push(card);
    card.x = card.x - this.x;
    card.y = card.y - this.y;
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
        card.z = 0;
        this.cards.splice(i--, 1);
        removed = true;
      } else if (removed) {
        card2.z--;
      }
    }
  }
}
