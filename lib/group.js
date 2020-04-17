import { intersecting } from './intersecting.js';

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

  add (entity) {
    if (entity.group) {
      entity.group.remove(entity);
      entity.x -= this.x;
      entity.y -= this.y;
    } else if (entity.game) {
      entity.x -= this.x;
      entity.y -= this.y;
    }
    entity.group = this;
    this.children.push(entity);
  }

  remove (entity) {
    const index = this.children.indexOf(entity);
    if (~index) {
      entity.x += this.x;
      entity.y += this.y;
      entity.group = null;
      this.children.splice(index, 1);
    }
  }

  intersecting (card) {
    for (let i = 0; i < this.children.length; i++) {
      const child = this.children[i];

      if (child === card) {
        continue;
      }

      if (intersecting(child, card)) {
        return true;
      }
    }

    return false;
  }
}
