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
    const shuffled = shuffle(this.children.slice());
    const left = [];
    const right = [];

    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];

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
        animations.push(animate(card, 200 * rate, {
          x: -60 + 15 * Math.random(),
          y: -i / 2
        }, i * 3 * rate));
      }

      if (i < right.length) {
        const card = right[i];
        animations.push(animate(card, 200 * rate, {
          x: 60 + 15 * Math.random(),
          y: -i / 2
        }, i * 3 * rate));
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

        animations.push(animate(card, 150 * rate, {
          x: -i / 4,
          y: -i / 4
        }, i * 5 * rate));
        i++;
      }

      all(animations, () => {
        for (let i = 0; i < this.children.length; i++) {
          this.children[i].i = shuffled[i].i;
          this.children[i].x = -i / 4;
          this.children[i].y = -i / 4;
        }
      });
    });
  }
}
