
export default {
  deck: function (deck) {
    deck.flip = deck.queued(flip)

    function flip (next) {
      var flipped = deck.cards.filter(function (card) {
        return card.side === 'front'
      }).length / deck.cards.length

      deck.cards.forEach(function (card, i) {
        card.setSide(flipped > 0.5 ? 'back' : 'front')
      })
      next()
    }
  }
}
