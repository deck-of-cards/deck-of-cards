
export default function (deck) {
  deck.poker = deck.queued(poker)

  function poker (next) {
    var cards = deck.cards
    var len = cards.length

    cards.slice(-5).reverse().forEach(function (card, i) {
      card.poker(i, len, function (i) {
        if (i === 4) {
          next()
        }
      })
    })
  }
}
