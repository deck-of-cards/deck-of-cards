
export default function (deck) {
  deck.bysuit = deck.queued(bysuit)

  function bysuit (next) {
    var cards = deck.cards

    cards.forEach(function (card) {
      card.bysuit(function (i) {
        if (i === cards.length - 1) {
          next()
        }
      })
    })
  }
}
