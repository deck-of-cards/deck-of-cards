export const cardInteraction = {
  type: 'Card',
  startmove (card, pos) {
  },
  holdmove (card) {
    if (card.parent) {
      card.parent._moving = true;
    }
  },
  move (card, pos, delta, diff, startPos) {
    if (card.parent) {
      if (card.parent._moving) {
        return;
      }
    }
    card.x += delta.x;
    card.y += delta.y;
  },
  endmove (card, pos, startPos) {
  }
};
