import { Entity } from './entity.js';
import { Pile } from './pile.js';

export class Card extends Entity {
  constructor (options = {}) {
    super({
      ...options,
      type: 'Card'
    });
    const { i, side } = options;

    this.i = i;
    this.side = side;

    Object.defineProperties(this, {
      _movingGroup: {
        writable: true,
        value: false
      }
    });
  }

  created () {
    this.el.addEventListener('mousedown', this);
    this.el.addEventListener('touchstart', this);
  }

  preMove () {
    this._moving = true;
  }

  click (e) {
    this.side = this.side === 'front' ? 'back' : 'front';
  }

  hold () {
    if (this.group) {
      this._movingGroup = true;
      this._moving = false;
      this.group.children[0]._moving = true;
    }
  }

  dblClick () {
    if (this.group && this.group.type === 'Deck') {
      this.group.shuffle();
    }
  }

  startMove (e) {
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

      const { group } = this;

      if (group) {
        if (!group.isIntersectingWith(this)) {
          group.remove(this, true);
          group.game.add(this);
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
      if (this.group) {
        this.group.moveBack(true);
      } else {
        const intersectingEntities = this.game.intersectingChildren(this);

        intersectingEntities.sort((a, b) => {
          return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        });

        const closest = intersectingEntities[0];

        if (!closest) {
          return;
        }

        if (closest.children) {
          if (closest.type === 'Pile' && closest.children.length === 1) {
            const diff = {
              x: Math.abs(closest.x - this.x),
              y: Math.abs(closest.y - this.y)
            };
            closest.dir = diff.y > diff.x ? 'vertical' : 'horizontal';
          }
          closest.add(this, true);
        } else {
          const diff = {
            x: Math.abs(closest.x - this.x),
            y: Math.abs(closest.y - this.y)
          };
          const pile = new Pile({
            game: this.game,
            dir: diff.y > diff.x ? 'vertical' : 'horizontal'
          });
          pile.x = closest.x;
          pile.y = closest.y;
          pile.add(closest);
          pile.add(this, true);
          this.game.add(pile);
        }
      }
    }
  }

  handleEvent (e) {
    if (e.type === 'mousedown' || e.type === 'touchstart') {
      const startPos = {
        x: (e.touches ? e.touches[0] : e).pageX,
        y: (e.touches ? e.touches[0] : e).pageY
      };
      const startTime = Date.now();

      this.preMove();

      let prevPos = startPos;
      let moved = false;
      const holdTimeout = setTimeout(() => {
        this.hold();
      }, 500);

      const now = Date.now();

      if (now - this._lastClick < 200) {
        this.dblClick();
      }

      this._lastClick = now;

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
        if (Date.now() - startTime < 200) {
          this.click();
        }
        this._moving = false;
        this._movingGroup = false;
        if (this.group) {
          this.group.children.forEach(item => {
            item._moving = false;
          });
        }
        clearTimeout(holdTimeout);
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
}
