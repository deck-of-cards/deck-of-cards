import { animate } from '../animate/index.js';

export function moveBack (withAnimation) {
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
