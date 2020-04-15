import { findMiddleware } from './middleware.js';
import { getAnimatedProps } from './animate.js';

export class Entity {
  constructor (options = {}) {
    const {
      parent,
      type,
      style,
      x = 0,
      y = 0,
      z = 0,
      i = 0
    } = options;

    this.parent = parent;
    this.type = type;
    this.style = style;
    this.x = x;
    this.y = y;
    this.z = z;
    this.i = i;
  }

  get middleware () {
    return findMiddleware(this);
  }

  get game () {
    let game = this.parent;

    while (game.parent) {
      game = game.parent;
    }

    return game;
  }

  trigger (event, ...data) {
    for (let i = 0; i < this.middleware.length; i++) {
      const middleware = this.middleware[i];
      const handler = middleware[event];

      if (handler) {
        handler(this, ...data);
      }
    }
  }

  get animatedPosition () {
    const animatedProps = getAnimatedProps(this);

    const pos = {
      x: this.x + (animatedProps.x || 0),
      y: this.y + (animatedProps.y || 0)
    };

    return pos;
  }

  get absolutePosition () {
    const pos = {
      x: this.x,
      y: this.y
    };

    let traverse = this.parent;

    while (traverse) {
      pos.x += traverse.x || 0;
      pos.y += traverse.y || 0;

      traverse = traverse.parent;
    }

    return pos;
  }
}
