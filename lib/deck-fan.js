
export default function (deck) {
  deck.fan = deck.queued(fan)

  function fan (next) {
    var cards = deck.cards

    cards.forEach(function (card, i) {
      card.fan(i, function (i) {
        if (i === 51) {
          next()
        }
      })
    })
  }
}
