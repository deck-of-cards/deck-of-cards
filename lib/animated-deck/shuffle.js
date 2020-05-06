import { animate, all } from '../animate/index.js';
import { shuffleArray } from '../shuffle.js';

export function shuffle () {
  doShuffle(this, () => {
    doShuffle(this, () => {
      doShuffle(this);
    });
  });
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

  (this.animations || []).forEach(animation => animation.destroy());
  this.animations = [];

  const rate = 1;

  for (let i = 0; i < left.length || i < right.length; i++) {
    if (i < left.length) {
      const card = left[i];
      card.side = 'back';
      this.animations.push(animate(card, 225 * rate, {
        x: -70 + 40 * Math.random(),
        y: -i / 2
      }, 54 * i * 3 * rate / deck.children.length, 'sineInOut'));
    }

    if (i < right.length) {
      const card = right[i];
      card.side = 'back';
      this.animations.push(animate(card, 225 * rate, {
        x: 70 + 40 * Math.random(),
        y: -i / 2
      }, 54 * i * 3 * rate / deck.children.length, 'sineInOut'));
    }
  }
  all(this.animations, () => {
    let i = 0;
    this.animations = [];
    while (left.length || right.length) {
      const random = Math.round(Math.random());
      const card = random
        ? (left.shift() || right.shift())
        : (right.shift() || left.shift());

      card.side = 'back';

      this.animations.push(animate(card, 225 * rate, {
        x: -i / 4,
        y: -i / 4
      }, 54 * i * 3 * rate / deck.children.length, 'sineInOut'));
      i++;
    }

    all(this.animations, () => {
      const shuffled = shuffleArray(deck.children);
      const found = {};
      const shuffledFound = {};
      for (let i = 0; i < deck.children.length; i++) {
        found[deck.children[i].i] = true;
        shuffledFound[shuffled[i].i] = true;
        deck.children[i].i = shuffled[i].i;
        deck.children[i].x = -i / 4;
        deck.children[i].y = -i / 4;
      }
      this.animations = [];
      cb && cb();
    });
  });
}