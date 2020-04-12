/* global requestAnimationFrame */

import { Game } from './game.js';
import { Deck } from './deck.js';
import { Renderer } from './renderer.js';
import { mouse } from './mouse.js';
import { interaction } from './interaction.js';

const game = new Game({
  container: document.querySelector('#cards'),
  width: 1920,
  height: 1080
});

const renderer = new Renderer({
  game
});

const deck = new Deck({
  x: 960,
  y: 540
});

game.addDeck(deck);

mouse(game, renderer);
interaction(game);

deck.shuffle();

renderer.mountTo(document.body);

render();

function render () {
  requestAnimationFrame(render);

  renderer.render();
}
