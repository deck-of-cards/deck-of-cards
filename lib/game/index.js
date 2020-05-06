import { add } from './add.js';
import { remove } from './remove.js';
import { createCards } from './create-cards.js';
import { intersectingChildren } from './intersecting-children.js';

export class Game {
  constructor (options = {}) {
    const { width = 1920, height = 1080, cardTypes = {} } = options;

    this.width = width;
    this.height = height;

    Object.defineProperties(this, {
      children: {
        writable: true,
        value: []
      },
      rendering: {
        writable: true,
        value: null
      },
      cardTypes: {
        writable: true,
        value: cardTypes
      }
    });
  }

  get entities () {
    return this.children
      .reduce((entities, child) => {
        if (child.children) {
          return entities.concat(child.children);
        } else {
          return entities.concat(child);
        }
      }, []);
  }

  get groups () {
    return this.children
      .filter(child => child.children != null);
  }
}

Game.prototype.createCards = createCards;
Game.prototype.add = add;
Game.prototype.remove = remove;
Game.prototype.intersectingChildren = intersectingChildren;
