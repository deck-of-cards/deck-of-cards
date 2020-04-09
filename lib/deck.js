import { Pile } from './pile.js';
import { Card } from './card.js';
import { standardDeck } from '../../standard-deck/dist/deck.js';
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
      x: -i / 4,
      y: -i / 4,
      z: i
    }));
  }

  shuffle () {
    shuffle(this.cards);
    this.cards.forEach((card, i) => {
      card.x = -i / 4;
      card.y = -i / 4;
      card.z = i;
    });
    this.game.pile();
  }

  moveBack (card) {
    const cardIndex = this.cards.indexOf(card);
    animate(card, 200, { x: -cardIndex / 4, y: -cardIndex / 4 });
  }

  push (card) {
    card.pile = this;
    card.x = card.x - this.x;
    card.y = card.y - this.y;

    animate(card, 200, {
      x: -this.cards.length / 4,
      y: -this.cards.length / 4
    });

    this.cards.push(card);
    card.z = this.cards.length - 1;
  }
}
