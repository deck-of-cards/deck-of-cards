/* global requestAnimationFrame, cancelAnimationFrame */

import { render } from './render.js';

export class Game {
  constructor (options = {}) {
    const { width = 1920, height = 1080 } = options;

    this.width = width;
    this.height = height;

    Object.defineProperties(this, {
      children: {
        writable: true,
        value: []
      },
      rendering: {
        writable: true,
        value: null
      }
    });
  }

  get entities () {
    return this.children
      .reduce((entities, child) => {
        if (child.children) {
          return entities.concat(child.children);
        } else {
          return entities.concat(child);
        }
      }, []);
  }

  get groups () {
    return this.children
      .filter(child => child.children != null);
  }

  add (item) {
    if (item.game) {
      item.game.remove(item);
    }
    if (item.group) {
      item.group.remove(item);
    }
    this.children.push(item);
    item.game = this;
    return this;
  }

  remove (item) {
    const index = this.children.indexOf(item);

    if (~index) {
      this.children.splice(index, 1);
      item.game = null;
    }
    return this;
  }

  render (container) {
    render(this, container);
  }

  startRender (container) {
    if (this.rendering) {
      return;
    }
    this.rendering = requestAnimationFrame(() => {
      this.rendering = null;
      this.startRender(container);
      this.render(container);
    });
  }

  intersectingChildren (other) {
    return this.children.filter(child => {
      return child.isIntersectingWith(other);
    });
  }

  stopRender () {
    cancelAnimationFrame(this.rendering);
  }
}
