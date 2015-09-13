
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
    var transition = prefix('transition')
    var transitionDelay = prefix('transition-delay')

    var $el = card.$el

    card.shuffle = function (cb) {
      var i = card.pos
      var z = i / 4
      var offsetX = plusMinus(Math.random() * 40 + 20) * fontSize/16
      var delay = i * 2

      $el.style[transition] = 'all .2s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
      $el.style[transitionDelay] = delay / 1000 + 's'

      setTimeout(function () {
        $el.style[transform] = translate(offsetX + 'px', -z + 'px')
        card.x = offsetX
        card.y = -z
      }, 0)

      setTimeout(function () {
        $el.style[transitionDelay] = ''
        $el.style.zIndex = i
      }, 100 + delay)

      setTimeout(function () {
        $el.style[transform] = translate(-z + 'px', -z + 'px')

        card.x = -z
        card.y = -z

        setTimeout(function () {
          $el.style[transition] = ''
          cb(i)
        }, 200)

      }, 200 + delay)
    }
  }
}
