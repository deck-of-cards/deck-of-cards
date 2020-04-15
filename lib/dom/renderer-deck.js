import { renderChildren } from './renderer-game.js';

export const deckRenderer = {
  type: 'Deck',
  createEl (deck) {
    const el = document.createElement('div');

    el.style.position = 'absolute';

    deck.el = el;
  },
  render (deck) {
    const { x, y, el } = deck;

    el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

    renderChildren(el, deck.children);
  }
};
