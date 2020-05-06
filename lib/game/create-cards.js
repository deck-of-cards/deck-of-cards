import { Card } from '../card/index.js';

export function createCards (options = {}, cardOptions = {}) {
  const { type } = options;
  const cardPrototype = this.cardTypes[type] || {};
  const {
    Card: CardClass = cardPrototype.Card || Card,
    start = 0,
    end = start || 0
  } = options;

  const cards = new Array(end - start);

  for (let i = start; i < end; i++) {
    const card = new CardClass({
      ...cardOptions,
      ...cardPrototype,
      i
    });

    cards[end - i] = card;
  }

  return cards;
}
