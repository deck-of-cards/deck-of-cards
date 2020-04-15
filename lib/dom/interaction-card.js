import { animate } from '../animate.js';
import { Pile } from '../pile.js';

export const cardInteraction = {
  type: 'Card',
  startmove (card, pos) {
    card.parent.add(card);
  },
  holdmove (card) {
    if (card.parent && (card.parent.type === 'Pile' || card.parent.type === 'Deck')) {
      card.parent.parent.add(card.parent);
      card.parent._moving = true;
    }
  },
  move (card, pos, delta, diff, startPos) {
    if (card.parent) {
      if (card.parent._moving) {
        return;
      }
    }
    if (card.parent) {
      if (card.parent.parent && !card.parent.intersecting(card)) {
        card.x += card.parent.x;
        card.y += card.parent.y;
        card.parent.parent.add(card);
      }
    }
    card.x += delta.x;
    card.y += delta.y;
  },
  endmove (card, pos, startPos) {
    if (card.parent) {
      if (card.parent._moving) {
        return;
      }
      const intersecting = card.parent.children.find(entity => {
        if (card === entity) {
          return false;
        }
        return entity.intersecting(card);
      });

      if (intersecting) {
        if (intersecting.type === 'Pile') {
          card.x -= intersecting.x;
          card.y -= intersecting.y;
          intersecting.add(card);
          const i = intersecting.children.length - 1;
          animate(card, 200, {
            x: intersecting.dir === 'horizontal' ? i * 15 : 0,
            y: intersecting.dir === 'vertical' ? i * 30 : 0
          });
        } else if (intersecting.type === 'Deck') {
          card.x -= intersecting.x;
          card.y -= intersecting.y;
          intersecting.add(card);
          const i = intersecting.children.length - 1;
          animate(card, 200, {
            x: -i / 4,
            y: -i / 4
          });
        } else if (intersecting.type === 'Card') {
          const pile = new Pile({ x: intersecting.x, y: intersecting.y });
          const diff = {
            x: card.x - intersecting.x,
            y: card.y - intersecting.y
          };
          intersecting.x = 0;
          intersecting.y = 0;
          if (Math.abs(diff.x) > Math.abs(diff.y)) {
            pile.dir = 'horizontal';
          } else {
            pile.dir = 'vertical';
          }
          card.x -= pile.x;
          card.y -= pile.y;
          const parent = card.parent;
          parent.add(pile);
          pile.add(intersecting);
          pile.add(card);
          animate(card, 200, {
            x: pile.dir === 'horizontal' ? 15 : 0,
            y: pile.dir === 'vertical' ? 30 : 0
          });
        }
      }
    }
  }
};
