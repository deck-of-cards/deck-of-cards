
import getFontSize from '../fontSize'

var fontSize

export default {
  deck: function (deck) {
    deck.bysuit = deck.queued(bysuit)

    function bysuit (next) {
      var cards = deck.cards

      fontSize = getFontSize()

      cards.forEach(function (card) {
        card.bysuit(function (i) {
          if (i === cards.length - 1) {
            next()
          }
        })
      })
    }
  },
  card: function (card) {
    var rank = card.rank
    var suit = card.suit

    card.bysuit = function (cb) {
      var i = card.i
      var delay = i * 10

      card.animateTo({
        delay: delay,
        duration: 400,

        x: -Math.round((6.75 - rank) * 8 * fontSize / 16),
        y: -Math.round((1.5 - suit) * 92 * fontSize / 16),
        rot: 0,

        onComplete: function () {
          cb(i)
        }
      })
    }
  }
}
