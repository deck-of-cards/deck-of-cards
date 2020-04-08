/* global requestAnimationFrame */

import { Game } from './game.js';
import { Deck } from './deck.js';

const game = new Game({
  width: 1920,
  height: 1080
});

const deck = new Deck({
  x: 960,
  y: 540
});

game.addDeck(deck);

game.mountTo(document.body);

game.addMouse();

render();

function render () {
  requestAnimationFrame(render);

  game.render();
}
