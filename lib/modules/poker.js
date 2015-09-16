
import animationFrames from '../animationframes'
import ease from '../ease'
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

    var $el = card.$el

    card.poker = function (i, len, cb) {
      var delay = i * 250
      var target = {
        x: Math.round((i - 2.05) * 70 * fontSize / 16),
        y: Math.round(-110 * fontSize / 16)
      }

      var xStart, yStart, rotStart
      var xDiff, yDiff, rotDiff

      animationFrames(delay, 250)
        .start(function () {
          xStart = card.x
          yStart = card.y
          rotStart = card.rot || 0

          xDiff = target.x - xStart
          yDiff = target.y - yStart
          rotDiff = 0 - rotStart
          $el.style.zIndex = (len - 1) + i
        })
        .progress(function (t) {
          t = ease.quadOut(t)
          card.x = xStart + xDiff * t
          card.y = yStart + yDiff * t
          card.rot = rotStart + rotDiff * t

          $el.style[transform] = translate(card.x + 'px', card.y + 'px') + (card.rot ? ' rotate(' + card.rot + 'deg)' : '')
        })
        .end(function () {
          cb(i)
        })

    }
  }
}
