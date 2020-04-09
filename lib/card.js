import { standardDeck } from '../../standard-deck/dist/deck.js';
import { cardIntersecting } from './card-intersecting.js';
import { Pile } from './pile.js';
import { animate } from './animate.js';

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

  onmovestart () {}

  onmove (diff) {
    const card = this;
    const { game } = card;

    card.x += diff.x;
    card.y += diff.y;

    if (card.pile) {
      card.pile.move(card);
    } else {
      const intersectingCards = game.cards
        .filter(card2 => !card2.pile)
        .filter(card2 => card !== card2)
        .filter(card2 => card.intersecting(card2));

      const intersectingPiles = game.piles
        .filter(pile => pile.cards.find(card2 => card.intersecting(card2)))
        .map(pile => {
          return {
            ...pile,
            z: Math.max(...pile.cards.map(card => card.z))
          };
        });

      const z = Math.max(-1, ...intersectingCards.concat(intersectingPiles).map(card => card.z)) + 1;

      if (card.z !== z) {
        animate(card, 150, { z });
      }
      game.pile();
    }
  }

  onmoveend () {
    const card = this;
    const { game } = card;

    if (card.pile) {
      card.pile.moveBack(card);
    } else {
      const intersectingPile = game.piles
        .find(pile => pile.cards.find(card2 => card.intersecting(card2)));

      if (intersectingPile) {
        intersectingPile.push(card);
        game.pile();
        return;
      }
      const intersectingCard = game.cards
        .filter(card2 => card !== card2)
        .filter(card2 => !card2.pile)
        .find(card2 => card.intersecting(card2));

      if (intersectingCard) {
        const pile = new Pile();
        pile.x = intersectingCard.x;
        pile.y = intersectingCard.y;

        const diffX = card.x - intersectingCard.x;
        const diffY = card.y - intersectingCard.y;

        if (Math.abs(diffY) > Math.abs(diffX)) {
          pile.vertical = true;
        }

        pile.push(intersectingCard);
        pile.push(card);

        game.addPile(pile);
        game.pile();
      }
    }
  }

  get width () {
    return this.graphics.width;
  }

  get height () {
    return this.graphics.height;
  }
}
