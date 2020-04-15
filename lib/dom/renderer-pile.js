import { renderChildren } from './renderer-game.js';

export const pileRenderer = {
  type: 'Pile',
  createEl (pile) {
    const el = document.createElement('div');

    el.style.position = 'absolute';

    pile.el = el;
  },
  render (pile) {
    const { x, y, el } = pile;

    el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

    renderChildren(el, pile.children);
  }
};
