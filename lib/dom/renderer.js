import { gameRenderer } from './renderer-game.js';
import { deckRenderer } from './renderer-deck.js';
import { cardRenderer } from './renderer-card.js';

export const domRenderer = [
  gameRenderer,
  deckRenderer,
  cardRenderer
];
