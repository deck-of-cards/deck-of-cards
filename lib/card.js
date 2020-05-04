import { Entity } from './entity.js';
import { Pile } from './pile.js';
import { handleEvent } from './card-interactivity.js';

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
        value: false,
        writable: true
      }
    });
  }

  created () {
    this.el.addEventListener('mousedown', this);
    this.el.addEventListener('touchstart', this);
    this.el.style.touchAction = 'none';
    this.el.style.userDrag = 'none';
    this.el.style.userSelect = 'none';
    this.el.style.webkitUserSelect = 'none';
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
      this.group.moveBack();
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
      const intersectingEntities = this.game.intersectingChildren(this)
        .filter(entity => entity !== this.group);

      intersectingEntities.sort((a, b) => {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
      });

      const closest = intersectingEntities[0];

      if (closest) {
        if (closest.type === 'Pile' || closest.type === 'Deck') {
          const move = this.group.children.filter(entity => entity.type === 'Card');

          move.forEach(entity => {
            closest.add(entity);
          });

          closest.moveBack(true);
        }
      }
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
}

Card.prototype.handleEvent = handleEvent;
