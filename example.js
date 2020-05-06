import { Game, AnimatedDeck, Renderer } from './lib/index.js';
import { standardDeck } from '../standard-deck/dist/index.js';

const gameSettings = {
  width: 1920,
  height: 1080,
  cardTypes: {
    standard: standardDeck
  }
};

const deckSettings = {
  x: 1920 / 2,
  y: 1080 / 2
};

const game = new Game(gameSettings);
const deck = new AnimatedDeck(deckSettings);

const standardCards = game.createCards({
  type: 'standard',
  start: 0,
  end: 52
}, {
  side: 'back'
});

game.add(deck);
deck.add(standardCards);

const $game = document.querySelector('#game');
const renderer = new Renderer(game, $game);
renderer.start();
