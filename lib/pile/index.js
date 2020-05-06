import { Group } from '../group/index.js';
import { animate } from '../animate/index.js';

export class Pile extends Group {
  constructor (options = {}) {
    const { dir } = options;
    super({
      ...options,
      type: 'Pile'
    });
    this.dir = dir;
  }

  moveBack () {
    const { dir } = this;

    for (let i = 0; i < this.children.length; i++) {
      animate(this.children[i], 200, {
        x: dir === 'horizontal' ? 15 * i : 0,
        y: dir === 'vertical' ? 30 * i : 0
      });
    }
  }
}
