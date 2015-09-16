
import animationFrames from '../animationframes'
import ease from '../ease'
import getFontSize from '../font-size'
import prefix from '../prefix'
import translate from '../translate'

var fontSize

export default {
  deck: function (deck) {
    deck.fan = deck.queued(fan)

    function fan (next) {
      var cards = deck.cards
      var len = cards.length

      fontSize = getFontSize()

      cards.forEach(function (card, i) {
        card.fan(i, len, function (i) {
          if (i === cards.length - 1) {
            next()
          }
        })
      })
    }
  },
  card: function (card) {
    var transform = prefix('transform')

    var $el = card.$el

    card.fan = function (i, len, cb) {
      var z = i / 4
      var delay = i * 10
      var rot = i / (len - 1) * 260 - 130

      var xStart
      var yStart
      var rotStart

      var xDiff
      var yDiff
      var rotDiff

      animationFrames(delay, 300)
        .start(function () {
          xStart = card.x
          yStart = card.y
          rotStart = card.rot || 0

          xDiff = -z - xStart
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
      animationFrames(300 + delay, 300)
        .start(function () {
          xStart = card.x
          yStart = card.y
          rotStart = card.rot || 0

          xDiff = Math.cos(deg2rad(rot - 90)) * 55 * fontSize / 16 - xStart
          yDiff = Math.sin(deg2rad(rot - 90)) * 55 * fontSize / 16 - yStart
          rotDiff = rot - rotStart
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

function deg2rad (degrees) {
  return degrees * Math.PI / 180
}
