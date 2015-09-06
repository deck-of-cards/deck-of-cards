
export default function (deck) {
  deck.fan = deck.queued(fan)

  function fan (next) {
    var cards = deck.cards
    var len = cards.length

    cards.forEach(function (card, i) {
      card.fan(i, len, function (i) {
        if (i === cards.length - 1) {
          next()
        }
      })
    })
  }
}
