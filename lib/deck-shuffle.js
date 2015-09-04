
export default function shuffleable (deck, cards) {
  var shuffling = -1

  deck.shuffle = function () {
    deck.queue(shuffle)
  }

  function shuffle (cb) {
    if (shuffling === 0) {
      shuffling = -1

      cb && cb()
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
          shuffle(cb)
        }
      })

    })
    return
  }
}
