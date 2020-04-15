export const deckInteraction = {
  type: 'Deck',
  startmove (deck, pos) {
    deck.parent.add(deck);
  },
  move (deck, pos, delta, diff, startPos) {
    if (deck._moving) {
      deck.x += delta.x;
      deck.y += delta.y;
    }
  },
  endmove (deck) {
    deck._moving = false;
  }
};
