import { Game } from './game.js';
import { Deck } from './deck.js';

const game = new Game({
  width: 1920,
  height: 1080
});

const deck = new Deck({
  x: 1920 / 2,
  y: 1080 / 2
});

game.add(deck);

deck.createCards(54, {
  style: 'standard',
  width: 100,
  height: 140
});

game.startRender(document.querySelector('#game'));
