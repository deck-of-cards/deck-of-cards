import { render } from './game-render.js';

export class Game {
  constructor (options = {}) {
    const { className = 'game', width = 1920, height = 1080 } = options;
    this.container = document.createElement('div');
    this.container.className = className;
    this.width = width;
    this.height = height;
    this.cards = [];
    this.decks = [];
  }

  get width () {
    return this._width;
  }

  set width (width) {
    this.container.style.width = width + 'px';
    this.container.style.marginLeft = -width / 2 + 'px';
    this._width = width;
  }

  get height () {
    return this._height;
  }

  set height (height) {
    this.container.style.height = height + 'px';
    this.container.style.marginTop = -height / 2 + 'px';
    this._height = height;
  }

  mountTo (parent) {
    parent.appendChild(this.container);
  }

  addDeck (deck) {
    this.decks.push(deck);
    for (let i = 0; i < deck.cards.length; i++) {
      const card = deck.cards[i];
      card.game = this;
      this.cards.push(card);
    }
  }

  render (container) {
    render(this, container);
  }
}
