
export default function (deck) {
  deck.bysuit = deck.queued(bysuit)

  function bysuit (next) {
    var cards = deck.cards

    cards.forEach(function (card) {
      card.bysuit(function (i) {
        if (i === 51) {
          next()
        }
      })
    })
  }
}
