import { Entity } from './entity.js';

export class Card extends Entity {
  constructor (options = {}) {
    super({
      ...options,
      type: 'Card'
    });
    const { i } = options;

    this.i = i;

    Object.defineProperties(this, {
      _movingGroup: {
        writable: true,
        value: false
      }
    });
  }

  preMove () {
    this._moving = true;
  }

  hold () {
    if (this.group) {
      this._movingGroup = true;
      this._moving = false;
      this.group.children[0]._moving = true;
    }
  }

  startMove () {
    if (this._movingGroup) {
      this.group.game.add(this.group);
    } else {
      if (this.group) {
        this.group.game.add(this.group);
        this.group.add(this);
      } else {
        this.game.add(this);
      }
    }
  }

  move (delta) {
    if (this._movingGroup) {
      this.group.x += delta.x;
      this.group.y += delta.y;
    } else {
      this.x += delta.x;
      this.y += delta.y;

      if (this.group) {
        if (!this.group.intersecting(this)) {
          this.group.game.add(this);
        }
      }
    }
  }

  endMove () {
    if (this._movingGroup) {
      this._movingGroup = false;
      this.group.children.forEach(item => {
        item._moving = false;
      });
    } else {
      this._moving = false;
    }
  }

  handleEvent (e) {
    if (e.type === 'mousedown' || e.type === 'touchstart') {
      const startPos = {
        x: (e.touches ? e.touches[0] : e).pageX,
        y: (e.touches ? e.touches[0] : e).pageY
      };

      this.preMove();

      let prevPos = startPos;
      let moved = false;
      const holdTimeout = setTimeout(() => {
        this.hold();
      }, 500);

      const move = (e) => {
        if (!moved) {
          clearTimeout(holdTimeout);
          this.startMove();
          moved = true;
        }

        const pos = {
          x: (e.touches ? e.touches[0] : e).pageX,
          y: (e.touches ? e.touches[0] : e).pageY
        };

        const delta = {
          x: pos.x - prevPos.x,
          y: pos.y - prevPos.y
        };

        this.move(delta);

        prevPos = pos;
      };

      const endmove = (e) => {
        if (moved) {
          this.endMove();
        }

        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', endmove);

        window.removeEventListener('touchmove', move);
        window.removeEventListener('touchend', endmove);
      };

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', endmove);

      window.addEventListener('touchmove', move);
      window.addEventListener('touchend', endmove);
    }
  }

  createEl () {
    const el = document.createElement('div');

    el.style.position = 'absolute';
    el.style.backgroundColor = '#fff';
    el.style.backgroundPosition = '50% 50%';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.borderRadius = `${6 / 1}% ${6 / 1.4}%`;
    el.style.overflow = 'hidden';
    el.style.willChange = 'transform';

    el.addEventListener('mousedown', this);
    el.addEventListener('touchstart', this);

    return el;
  }

  render (el, data) {
    const { i, width, height, absolutePosition, _moving } = data;
    const { x, y } = absolutePosition;

    el.style.transform = `translate(${x}px, ${y}px)`;
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.marginLeft = -width / 2 + 'px';
    el.style.marginTop = -height / 2 + 'px';
    el.style.backgroundImage = `url(standard-deck/front-${i}.png)`;
    if (_moving) {
      el.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.25)';
    } else {
      el.style.boxShadow = '0px 1px 1px rgba(0, 0, 0, 0.05)';
    }
  }
}
