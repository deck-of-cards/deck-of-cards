import { createCard } from './create-card.js';

export function createCards (count) {
  const cards = new Array(count);

  for (let i = 0; i < cards.length; i++) {
    cards[i] = createCard(i);
  }

  return cards;
}
