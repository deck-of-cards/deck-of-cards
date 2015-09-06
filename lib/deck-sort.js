
export default function (deck) {
  deck.sort = deck.queued(sort)

  function sort (next, reverse) {
    var cards = deck.cards

    cards.sort(function (a, b) {
      if (reverse) {
        return a.i - b.i
      } else {
        return b.i - a.i
      }
    })

    cards.forEach(function (card, i) {
      card.sort(i, function (i) {
        if (i === cards.length - 1) {
          next()
        }
      }, reverse)
    })
  }
}
