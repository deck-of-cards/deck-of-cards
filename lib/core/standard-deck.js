import { createCards } from './create-cards.js';

export function createStandardDeck () {
  return createCards(52);
}

export function createStandardDeckWithJokers () {
  return createCards(54);
}
