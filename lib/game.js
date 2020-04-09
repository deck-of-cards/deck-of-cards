import { render } from './game-render.js';
import { enableDragging } from './game-enable-dragging.js';
import { generateUID } from './uid.js';
import { pile } from './game-pile.js';

export class Game {
  constructor (options = {}) {
    const { width = 1920, height = 1080 } = options;
    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.top = '50%';
    this.container.style.left = '50%';
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

  getPos (card, doAnimations) {
    const { x, y, z, pile, animate = {} } = card;

    const diff = doAnimations ? animations(card, animate) : {};

    if (pile) {
      return {
        x: x + (diff.x || 0) + pile.x,
        y: y + (diff.y || 0) + pile.y,
        z: z + (diff.z || 0) + pile.z
      };
    } else {
      return {
        x: x + (diff.x || 0),
        y: y + (diff.y || 0),
        z: z + (diff.z || 0)
      };
    }
  }

  enableDragging () {
    enableDragging(this);
  }
}

function animations (card, animate) {
  const now = Date.now();

  const diff = {};

  for (const key in animate) {
    const { duration, to } = animate[key];
    let { start, end, from } = animate[key];

    if (!start) {
      start = animate[key].start = Date.now();
      end = animate[key].end = start + duration;
    }

    if (now < end) {
      diff[key] = (end - Date.now()) / duration * (from - to);
    }
  }

  return diff;
}
