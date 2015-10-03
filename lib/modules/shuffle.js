
import getFontSize from '../fontSize'
import fisherYates from '../fisherYates'
import plusMinus from '../plusminus'

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
    var $el = card.$el

    card.shuffle = function (cb) {
      var i = card.pos
      var z = i / 4
      var delay = i * 2

      card.animateTo({
        delay: delay,
        duration: 200,

        x: plusMinus(Math.random() * 40 + 20) * fontSize / 16,
        y: -z,
        rot: 0
      })
      card.animateTo({
        delay: 200 + delay,
        duration: 200,

        x: -z,
        y: -z,
        rot: 0,

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
