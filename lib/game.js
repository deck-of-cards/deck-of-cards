import { render } from './game-render.js';
import { addMouse } from './game-add-mouse.js';
import { generateUID } from './uid.js';
import { pile } from './game-pile.js';

export class Game {
  constructor (options = {}) {
    const { className = 'game', width = 1920, height = 1080 } = options;
    this.container = document.createElement('div');
    this.container.className = className;
    this.width = width;
    this.height = height;
    this.cards = [];
    this.piles = [];
    this._uids = {};
    this._cards = {};
    this._moving = [];
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
    this.addPile(deck);
  }

  addPile (pile) {
    pile.game = this;
    this.piles.push(pile);
    for (let i = 0; i < pile.cards.length; i++) {
      const card = pile.cards[i];
      card.game = this;
      card.id = generateUID(this._uids);
      this.cards.push(card);
      this._cards[card.id] = card;
    }
  }

  pile () {
    pile(this);
  }

  onmovestart ({ card, i }) {
    card.onmovestart();
  }

  onmove ({ i, card, diff }) {
    card.onmove(diff);
  }

  onmoveend ({ card }) {
    card.onmoveend();
  }

  render (container) {
    render(this, container);
  }

  getCard (id) {
    return this._cards[id];
  }

  getPos (card) {
    const { x, y, z, pile } = card;
    if (pile) {
      return {
        x: x + pile.x,
        y: y + pile.y,
        z: z + pile.z
      };
    } else {
      return {
        x,
        y,
        z
      };
    }
  }

  getRenderPos (card) {
    const { x, y, z } = this.getPos(card);

    return {
      x: x - z / 4,
      y: y - z / 4
    };
  }

  addMouse () {
    addMouse(this);
  }
}
