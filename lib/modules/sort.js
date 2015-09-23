
export default {
  deck: function (deck) {
    deck.sort = deck.queued(sort)

    function sort (next, reverse) {
      var cards = deck.cards

      cards.sort(function (a, b) {
        if (reverse) {
          return a.i - b.i
        } else {
          return b.i - a.i
        }
      })

      cards.forEach(function (card, i) {
        card.sort(i, cards.length, function (i) {
          if (i === cards.length - 1) {
            next()
          }
        }, reverse)
      })
    }
  },
  card: function (card) {
    var $el = card.$el

    card.sort = function (i, len, cb, reverse) {
      var z = i / 4
      var delay = i * 10

      card.animateTo({
        delay: delay,
        duration: 400,

        x: -z,
        y: -150,
        rot: 0,

        onComplete: function () {
          $el.style.zIndex = i
        }
      })

      card.animateTo({
        delay: delay + 500,
        duration: 400,

        x: -z,
        y: -z,
        rot: 0,

        onComplete: function () {
          cb(i)
        }
      })
    }
  }
}
