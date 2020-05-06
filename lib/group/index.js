import { isIntersectingWith } from './intersecting.js';
import { add } from './add.js';
import { remove } from './remove.js';
import { distanceTo } from './distance-to.js';

export class Group {
  constructor (options) {
    const {
      game,
      type,
      x,
      y
    } = options;
    this.type = type;
    this.x = x;
    this.y = y;

    Object.defineProperties(this, {
      children: {
        writable: true,
        value: []
      },
      game: {
        writable: true,
        value: game
      }
    });
  }
}

Group.prototype.add = add;
Group.prototype.remove = remove;
Group.prototype.isIntersectingWith = isIntersectingWith;
Group.prototype.distanceTo = distanceTo;
