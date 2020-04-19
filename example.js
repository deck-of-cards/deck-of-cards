import { Game } from './lib/game.js';
import { Deck } from './lib/deck.js';

import { standardDeck } from '../standard-deck/dist/index.js';

const game = new Game({
  width: 1920,
  height: 1080
});

const deck = new Deck({
  x: 1920 / 2,
  y: 1080 / 2
});

game.add(deck);

deck.createCards(54, standardDeck, {
  side: 'back'
});

game.startRender(document.querySelector('#game'));
