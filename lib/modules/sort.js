
import translate from '../translate'
import prefix from '../prefix'

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
        card.sort(i, function (i) {
          if (i === cards.length - 1) {
            next()
          }
        }, reverse)
      })
    }
  },
  card: function (card) {
    var transform = prefix('transform')
    var transition = prefix('transition')

    var $el = card.$el

    card.sort = function (n, cb, reverse) {
      var z = n / 4
      var delay = n * 10

      setTimeout(function () {
        $el.style[transition] = 'all .4s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
        $el.style[transform] = translate(-z + 'px', '-150%')
      }, delay)

      setTimeout(function () {
        $el.style.zIndex = n
      }, 200 + delay)

      setTimeout(function () {
        $el.style[transform] = translate(-z + 'px', -z + 'px')

        setTimeout(function () {
          $el.style[transition] = ''
          card.x = -z
          card.y = -z
          cb(n)
        }, 500)

      }, 400 + delay)
    }
  }
}
