
export default function shuffleable (deck) {

  deck.shuffle = deck.queued(shuffle)

  function shuffle (next) {
    var cards = deck.cards

    cards.sort(function () {
      return Math.random() * 100 - 50
    })

    cards.forEach(function (card, i) {
      card.pos = i

      card.shuffle(function (i) {
        if (i === 51) {
          next()
        }
      })
    })
    return
  }
}
