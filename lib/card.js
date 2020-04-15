import { Entity } from './entity.js';

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

  update (data) {
    const { x, y, z, i, side } = data;

    this.x = x;
    this.y = y;
    this.z = z;
    this.i = i;
    this.side = side;
  }
}
