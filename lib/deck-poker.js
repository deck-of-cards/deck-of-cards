
export default function (deck) {
  deck.poker = deck.queued(poker)

  function poker (next) {
    var cards = deck.cards

    cards.slice(-5).reverse().forEach(function (card, i) {
      card.poker(i, function (i) {
        if (i === 4) {
          next()
        }
      })
    })
  }
}
