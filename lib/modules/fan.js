
import prefix from '../prefix'
import translate from '../translate'

export default {
  deck: function (deck) {
    deck.fan = deck.queued(fan)

    function fan (next) {
      var cards = deck.cards
      var len = cards.length

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
    var transformOrigin = prefix('transformOrigin')
    var transition = prefix('transition')
    var transitionDelay = prefix('transitionDelay')

    var $el = card.$el

    card.fan = function (i, len, cb) {
      var z = i / 4
      var delay = i * 10
      var rot = i / (len - 1) * 260 - 130

      $el.style[transformOrigin] = '50% 110%'

      setTimeout(function () {
        $el.style[transition] = 'all .3s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
        $el.style[transitionDelay] = delay / 1000 + 's'
        $el.style[transform] = translate(-z + 'px', -z + 'px')
        $el.style.zIndex = i

        setTimeout(function () {
          $el.style[transitionDelay] = ''
          $el.style[transform] = translate(0, 0) + 'rotate(' + rot + 'deg)'
        }, 300 + delay)
      }, 0)

      setTimeout(function () {
        cb(i)
      }, 1000 + delay)
    }
  }
}
