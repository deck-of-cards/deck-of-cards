import { on } from './events.js';
import { animate } from './animate.js';
import { Pile } from './pile.js';

export function interaction (game) {
  on(game, 'cardmove', options => {
    const { card, x, y } = options;
    const { game } = card;

    card.x += x;
    card.y += y;

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
  });

  on(game, 'cardmoveend', (options) => {
    const { card } = options;
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
  });
}
