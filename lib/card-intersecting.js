import { intersecting } from './intersecting.js';

export function cardIntersecting (card, anotherCard) {
  const { x: x1, y: y1 } = card.game.getPos(card);
  const { x: x2, y: y2 } = card.game.getPos(anotherCard);
  const { width: w1, height: h1 } = anotherCard;
  const { width: w2, height: h2 } = anotherCard;

  return intersecting({
    x: x1,
    y: y1,
    width: w1,
    height: h1
  }, {
    x: x2,
    y: y2,
    width: w2,
    height: h2
  });
}
