import { getAnimatedProps } from './animate.js';

export class Entity {
  constructor (options = {}) {
    const {
      game,
      group,
      type,
      style,
      x,
      y,
      width,
      height
    } = options;

    this.type = type;
    this.style = style;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    Object.defineProperties(this, {
      _game: {
        writable: true,
        value: game
      },
      group: {
        writable: true,
        value: group
      }
    });
  }

  get absolutePosition () {
    const pos = {
      x: this.x,
      y: this.y
    };

    const animatedProps = getAnimatedProps(this);

    pos.x += animatedProps.x || 0;
    pos.y += animatedProps.y || 0;

    if (this.group) {
      pos.x += this.group.x;
      pos.y += this.group.y;
    }

    return pos;
  }

  set game (game) {
    this._game = game;
  }

  get game () {
    return this.group ? this.group.game : this._game;
  }
}
