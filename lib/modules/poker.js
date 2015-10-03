
import getFontSize from '../fontSize'

var fontSize

export default {
  deck: function (deck) {
    deck.poker = deck.queued(poker)

    function poker (next) {
      var cards = deck.cards
      var len = cards.length

      fontSize = getFontSize()

      cards.slice(-5).reverse().forEach(function (card, i) {
        card.poker(i, len, function (i) {
          card.setSide('front')
          if (i === 4) {
            next()
          }
        })
      })
    }
  },
  card: function (card) {
    var $el = card.$el

    card.poker = function (i, len, cb) {
      var delay = i * 250

      card.animateTo({
        delay: delay,
        duration: 250,

        x: Math.round((i - 2.05) * 70 * fontSize / 16),
        y: Math.round(-110 * fontSize / 16),
        rot: 0,

        onStart: function () {
          $el.style.zIndex = (len - 1) + i
        },
        onComplete: function () {
          cb(i)
        }
      })
    }
  }
}
