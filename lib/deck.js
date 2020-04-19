import { Group } from './group.js';
import { Card } from './card.js';
import { animate, all } from './animate.js';
import { shuffle } from './shuffle.js';

export class Deck extends Group {
  constructor (options = {}) {
    super({
      ...options,
      type: 'Deck'
    });
  }

  createCards (count, options, options2) {
    for (let i = 0; i < count; i++) {
      const card = new Card({
        ...options,
        ...options2,
        i: count - i - 1,
        x: -i / 4,
        y: -i / 4
      });
      this.add(card);
    }

    return this;
  }

  moveBack (withAnimation) {
    for (let i = 0; i < this.children.length; i++) {
      const target = {
        x: -i / 4,
        y: -i / 4
      };
      if (withAnimation) {
        animate(this.children[i], 200, target);
      } else {
        this.children[i].x = target.x;
        this.children[i].y = target.y;
      }
    }
  }

  shuffle () {
    doShuffle(this, () => {
      doShuffle(this, () => {
        doShuffle(this);
      });
    });
  }
}

function doShuffle (deck, cb) {
  const left = [];
  const right = [];

  for (let i = 0; i < deck.children.length; i++) {
    const child = deck.children[i];

    if (Math.round(Math.random())) {
      right.push(child);
    } else {
      left.push(child);
    }
  }

  const animations = [];

  const rate = 1;

  for (let i = 0; i < left.length || i < right.length; i++) {
    if (i < left.length) {
      const card = left[i];
      card.side = 'back';
      animations.push(animate(card, 225 * rate, {
        x: -70 + 40 * Math.random(),
        y: -i / 2
      }, 54 * i * 3 * rate / deck.children.length, 'sineInOut'));
    }

    if (i < right.length) {
      const card = right[i];
      card.side = 'back';
      animations.push(animate(card, 225 * rate, {
        x: 70 + 40 * Math.random(),
        y: -i / 2
      }, 54 * i * 3 * rate / deck.children.length, 'sineInOut'));
    }
  }
  all(animations, () => {
    let i = 0;
    const animations = [];
    while (left.length || right.length) {
      const random = Math.round(Math.random());
      const card = random
        ? (left.shift() || right.shift())
        : (right.shift() || left.shift());

      animations.push(animate(card, 225 * rate, {
        x: -i / 4,
        y: -i / 4
      }, 54 * i * 3 * rate / deck.children.length, 'sineInOut'));
      i++;
    }

    all(animations, () => {
      const shuffled = shuffle(deck.children);
      const found = {};
      const shuffledFound = {};
      for (let i = 0; i < deck.children.length; i++) {
        found[deck.children[i].i] = true;
        shuffledFound[shuffled[i].i] = true;
        deck.children[i].i = shuffled[i].i;
        deck.children[i].x = -i / 4;
        deck.children[i].y = -i / 4;
      }
      cb && cb();
    });
  });
}
