
import getFontSize from '../font-size'
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
    var transition = prefix('transition')
    var transitionDelay = prefix('transition-delay')

    var value = card.value
    var suit = card.suit

    var $el = card.$el

    card.bysuit = function (cb) {
      var i = card.i
      var delay = i * 10
      var posX = -Math.round((6.75 - value) * 8 * fontSize / 16)
      var posY = -Math.round((1.5 - suit) * 92 * fontSize / 16)

      setTimeout(function () {
        $el.style[transition] = 'all .5s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
        $el.style[transitionDelay] = delay / 1000 + 's'
        $el.style[transform] = translate(posX + 'px', posY + 'px')
        $el.style.zIndex = i

        card.x = posX
        card.y = posY

        setTimeout(function () {
          $el.style[transition] = ''
          cb(i)
        }, 500 + delay)

      }, 0)
    }
  }
}
