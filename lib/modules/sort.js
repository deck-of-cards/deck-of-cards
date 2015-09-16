
import animationFrames from '../animationframes'
import ease from '../ease'
import prefix from '../prefix'
import translate from '../translate'

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
    var transform = prefix('transform')

    var $el = card.$el

    card.sort = function (i, len, cb, reverse) {
      var z = i / 4
      var delay = i * 10

      var xStart
      var yStart
      var rotStart

      var xDiff
      var yDiff
      var rotDiff

      animationFrames(delay, 400)
        .start(function () {
          xStart = card.x
          yStart = card.y
          rotStart = card.rot
          xDiff = -z - xStart
          yDiff = -150 - yStart
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
          $el.style.zIndex = i
        })

      animationFrames(delay + 500, 400)
        .start(function () {
          yStart = card.y
          yDiff = -z - yStart
        })
        .progress(function (t) {
          t = ease.quadOut(t)
          card.y = yStart + yDiff * t
          $el.style[transform] = translate(-z + 'px', card.y + 'px')
        })
        .end(function () {
          cb(i)
        })
    }
  }
}
