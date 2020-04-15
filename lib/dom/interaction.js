import { entityInteraction } from './interaction-entity.js';
import { cardInteraction } from './interaction-card.js';
import { pileInteraction } from './interaction-pile.js';
import { deckInteraction } from './interaction-deck.js';

export const interaction = [
  entityInteraction,
  cardInteraction,
  pileInteraction,
  deckInteraction
];
