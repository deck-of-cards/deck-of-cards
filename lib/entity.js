import { findMiddleware } from './middleware.js';

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
}
