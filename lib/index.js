import { Deck } from './deck.js';
import { Game } from './game.js';
import standardDeck from '../../standard-deck/dist/index.js';
import { domRenderer } from './dom/renderer.js';
import { interaction } from './dom/interaction.js';

const game = new Game({
  width: 1920,
  height: 1080,
  DEBUG: true
});

game.use(domRenderer);
game.use(standardDeck);
game.use(interaction);

const deck = new Deck({
  x: 1920 / 2,
  y: 1080 / 2
});

game.add(deck);

deck.createCards();

const container = document.getElementById('cards');

game.render(container);
