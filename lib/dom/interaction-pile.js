export const pileInteraction = {
  type: 'Pile',
  startmove (pile, pos) {
    pile.parent.add(pile);
  },
  move (pile, pos, delta, diff, startPos) {
    if (pile._moving) {
      pile.x += delta.x;
      pile.y += delta.y;
    }
  },
  endmove (pile) {
    pile._moving = false;
  }
};
