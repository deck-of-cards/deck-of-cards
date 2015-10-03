
import getFontSize from '../fontSize'

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
    var $el = card.$el

    card.fan = function (i, len, cb) {
      var z = i / 4
      var delay = i * 10
      var rot = i / (len - 1) * 260 - 130

      card.animateTo({
        delay: delay,
        duration: 300,

        x: -z,
        y: -z,
        rot: 0
      })
      card.animateTo({
        delay: 300 + delay,
        duration: 300,

        x: Math.cos(deg2rad(rot - 90)) * 55 * fontSize / 16,
        y: Math.sin(deg2rad(rot - 90)) * 55 * fontSize / 16,
        rot: rot,

        onStart: function () {
          $el.style.zIndex = i
        },

        onComplete: function () {
          cb(i)
        }
      })
    }
  }
}

function deg2rad (degrees) {
  return degrees * Math.PI / 180
}
