import { generateUID } from './uid.js';
import { pile } from './game-pile.js';
import { animations } from './animate.js';
import { on, trigger } from './events.js';

export class Game {
  constructor (options = {}) {
    const { width = 1920, height = 1080 } = options;

    this.width = width;
    this.height = height;
    this.cards = [];
    this.piles = [];
    this._uids = {};
    this._cards = {};
    this._moving = [];

    on(this, 'movestart', ({ card, i }) => {
      trigger(card, 'movestart');
    });

    on(this, 'move', ({ i, card, diff }) => {
      trigger(card, 'move', diff);
    });

    on(this, 'moveend', ({ card }) => {
      trigger(card, 'moveend');
    });
  }

  addDeck (deck) {
    this.addPile(deck);
  }

  addPile (pile) {
    pile.game = this;
    this.piles.push(pile);
    for (let i = 0; i < pile.cards.length; i++) {
      const card = pile.cards[i];
      card.game = this;
      card.id = generateUID(this._uids);
      this.cards.push(card);
      this._cards[card.id] = card;
    }
  }

  pile () {
    pile(this);
  }

  getCard (id) {
    return this._cards[id];
  }

  getPos (card, doAnimations) {
    const { x, y, z, pile, animate = {} } = card;

    const diff = doAnimations ? animations(card, animate) : {};

    if (pile) {
      return {
        x: x + (diff.x || 0) + pile.x,
        y: y + (diff.y || 0) + pile.y,
        z: z + (diff.z || 0) + pile.z
      };
    } else {
      return {
        x: x + (diff.x || 0),
        y: y + (diff.y || 0),
        z: z + (diff.z || 0)
      };
    }
  }
}
