import {
  Game,
  Deck,
  Renderer
} from './lib/index.js';

import {
  standardDeck
} from '../standard-deck/dist/index.js';

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

const $game = document.querySelector('#game');
const renderer = new Renderer(game, $game);
renderer.start();
