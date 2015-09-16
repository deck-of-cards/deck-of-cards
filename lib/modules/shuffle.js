
import animationFrames from '../animationframes'
import ease from '../ease'
import getFontSize from '../font-size'
import fisherYates from '../fisher-yates'
import plusMinus from '../plusminus'
import prefix from '../prefix'
import translate from '../translate'

var fontSize

export default {
  deck: function (deck) {
    deck.shuffle = deck.queued(shuffle)

    function shuffle (next) {
      var cards = deck.cards

      fontSize = getFontSize()

      fisherYates(cards)

      cards.forEach(function (card, i) {
        card.pos = i

        card.shuffle(function (i) {
          if (i === cards.length - 1) {
            next()
          }
        })
      })
      return
    }
  },

  card: function (card) {
    var transform = prefix('transform')

    var $el = card.$el

    card.shuffle = function (cb) {
      var i = card.pos
      var z = i / 4
      var offsetX = plusMinus(Math.random() * 40 + 20) * fontSize / 16
      var delay = i * 2

      var xStart
      var yStart
      var rotStart

      var xDiff
      var yDiff
      var rotDiff

      animationFrames(delay, 200)
        .start(function () {
          xStart = card.x
          yStart = card.y
          rotStart = card.rot || 0

          xDiff = offsetX - xStart
          yDiff = -z - yStart
          rotDiff = 0 - rotStart
        })
        .progress(function (t) {
          t = ease.quadOut(t)
          card.x = xStart + xDiff * t
          card.y = yStart + yDiff * t
          card.rot = rotStart + rotDiff * t
          $el.style[transform] = translate(card.x + 'px', card.y + 'px') + (card.rot ? ' rotate(' + card.rot + 'deg)' : '')
        })
      animationFrames(200 + delay, 200)
        .start(function () {
          xStart = card.x
          yStart = card.y
          rotStart = card.rot || 0

          xDiff = -z - xStart
          yDiff = -z - yStart
          rotDiff = 0 - rotStart

          $el.style.zIndex = i
        })
        .progress(function (t) {
          t = ease.quadOut(t)
          card.x = xStart + xDiff * t
          card.y = yStart + yDiff * t
          card.rot = rotStart + rotDiff * t
          $el.style[transform] = translate(card.x + 'px', card.y + 'px') + (card.rot ? ' rotate(' + card.rot + 'deg)' : '')
        })
        .end(function () {
          setTimeout(function () {
            cb(i)
          }, 0)
        })
    }
  }
}
