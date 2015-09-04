
export default function shuffleable (deck) {
  var shuffling = -1

  deck.shuffle = deck.queued(shuffle)

  function shuffle (next) {
    var cards = deck.cards

    if (shuffling === 0) {
      shuffling = -1

      next && next()
      return
    }

    if (shuffling === -1) {
      shuffling = 1
    } else {
      shuffling--
    }

    cards.sort(function () {
      return Math.random() * 100 - 50
    })

    cards.forEach(function (card, i) {
      card.pos = i

      card.shuffle(shuffling, function (i) {
        if (i === 51) {
          shuffle(next)
        }
      })

    })
    return
  }
}
