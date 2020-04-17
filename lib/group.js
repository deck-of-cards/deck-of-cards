import { isIntersectingWith } from './intersecting.js';

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

  add (entity, animate) {
    if (entity.group) {
      entity.group.remove(entity);
      entity.x -= this.x;
      entity.y -= this.y;
    } else if (entity.game) {
      entity.game.remove(entity);
      entity.x -= this.x;
      entity.y -= this.y;
    }
    entity.group = this;
    this.children.push(entity);
    animate && this.moveBack();
  }

  remove (entity, animate) {
    const index = this.children.indexOf(entity);
    if (~index) {
      entity.x += this.x;
      entity.y += this.y;
      entity.group = null;
      this.children.splice(index, 1);
    }
    animate && this.moveBack();
  }

  isIntersectingWith (other) {
    if (other.children) {
      return this.children.find(child => {
        return other.children.find(child2 => {
          return isIntersectingWith(child, child2);
        });
      });
    } else {
      return this.children.find(child => {
        return isIntersectingWith(other, child);
      });
    }
  }

  distanceTo (other) {
    return this.children.reduce((min, child) => {
      return Math.min(min, Math.sqrt(Math.pow(other.x - child.x, 2) + Math.pow(other.y - child.y, 2)));
    }, Infinity);
  }
}
