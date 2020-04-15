/* global requestAnimationFrame, cancelAnimationFrame */

import { findMiddleware } from './middleware.js';

export class Game {
  constructor (options = {}) {
    const {
      width = 1920,
      height = 1080,
      DEBUG
    } = options;
    this.type = 'Game';
    this.width = width;
    this.height = height;
    this.children = [];
    this.middleware = [];

    if (DEBUG) {
      this.DEBUG = DEBUG;
    }
  }

  trigger (event, data) {
    findMiddleware({ ...this, game: this })
      .forEach(middleware => {
        const handler = middleware[event];

        if (handler) {
          handler(this, data);
        }
      });
  }

  startRender (container) {
    this._rendering = requestAnimationFrame(() => {
      this.startRender(container);
      this.render(container);
    });
  }

  stopRender () {
    cancelAnimationFrame(this._rendering);
  }

  render (container) {
    this.trigger('renderGame', container);
  }

  add (entity) {
    if (entity.parent) {
      entity.parent.remove(entity);
    }
    entity.parent = this;

    this.children.push(entity);

    entity.trigger('add');

    return this;
  }

  remove (entity) {
    const index = this.children.indexOf(entity);

    if (~index) {
      this.children.splice(index, 1);
      entity.trigger('remove');
      entity.parent = null;
    }

    return this;
  }

  use (middleware) {
    if (middleware.length) {
      middleware.forEach((middleware) => {
        this.middleware.push(middleware);
      });
    } else {
      this.middleware.push(middleware);
    }
  }
}
