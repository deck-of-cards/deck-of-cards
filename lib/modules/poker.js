
import getFontSize from '../font-size'
import prefix from '../prefix'
import translate from '../translate'

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
    var transform = prefix('transform')
    var transition = prefix('transition')

    var $el = card.$el

    card.poker = function (i, len, cb) {
      var delay = i * 250
      var target = {
        x: (i - 2.05) * 70 * fontSize / 16,
        y: -110 * fontSize / 16
      }

      setTimeout(function () {
        $el.style.zIndex = (len - 1) + i
      }, delay)

      setTimeout(function () {
        $el.style[transition] = 'all .25s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
        $el.style[transform] = translate(target.x + 'px', target.y + 'px')

        card.x = target.x
        card.y = target.y
      }, delay + 25)

      setTimeout(function () {
        $el.style[transition] = ''
        cb(i)
      }, delay + 250)
    }
  }
}
