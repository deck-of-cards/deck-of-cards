
export default function (deck) {
  deck.intro = deck.queued(intro)

  function intro (next) {
    var cards = deck.cards

    cards.forEach(function (card, i) {
      card.intro(i, function (i) {
        if (i === 51) {
          next()
        }
      })
    })
  }
}
