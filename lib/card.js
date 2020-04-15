import { Entity } from './entity.js';
import { intersecting } from './intersecting.js';

export class Card extends Entity {
  constructor (options = {}) {
    const {
      style = 'standard',
      x = 0,
      y = 0,
      z = 0,
      i,
      side = 'front'
    } = options;

    super({ type: 'Card', style, x, y, z, i });
    this.side = side;
  }

  intersecting (entity) {
    return intersecting({
      x: this.absolutePosition.x,
      y: this.absolutePosition.y,
      width: this.width,
      height: this.height
    }, {
      x: entity.absolutePosition.x,
      y: entity.absolutePosition.y,
      width: entity.width,
      height: entity.height
    });
  }

  update (data) {
    const { x, y, z, i, side } = data;

    this.x = x;
    this.y = y;
    this.z = z;
    this.i = i;
    this.side = side;
  }
}
