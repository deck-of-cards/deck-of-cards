
import animationFrames from '../animationframes'
import getFontSize from '../font-size'
import ease from '../ease'
import prefix from '../prefix'
import translate from '../translate'

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
    var transform = prefix('transform')

    var rank = card.rank
    var suit = card.suit

    var $el = card.$el

    card.bysuit = function (cb) {
      var i = card.i
      var delay = i * 10
      var posX = -Math.round((6.75 - rank) * 8 * fontSize / 16)
      var posY = -Math.round((1.5 - suit) * 92 * fontSize / 16)

      var xStart
      var yStart
      var xDiff
      var yDiff
      var rotStart
      var rotDiff

      animationFrames(delay, 400)
        .start(function () {
          xStart = card.x
          yStart = card.y
          rotStart = card.rot || 0
          xDiff = posX - xStart
          yDiff = posY - yStart
          rotDiff = 0 - rotStart
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
