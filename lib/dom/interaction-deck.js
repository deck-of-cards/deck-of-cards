export const deckInteraction = {
  type: 'Deck',
  startmove (deck, pos) {
  },
  move (deck, pos, diff, startPos) {
  },
  endmove (deck) {
    deck._moving = false;
  }
};
