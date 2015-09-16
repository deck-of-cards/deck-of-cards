
import animationFrames from '../animationframes'
import ease from '../ease'
import prefix from '../prefix'
import translate from '../translate'

export default {
  deck: function (deck) {
    deck.intro = deck.queued(intro)

    function intro (next) {
      var cards = deck.cards

      cards.forEach(function (card, i) {
        card.setSide('front')
        card.intro(i, function (i) {
          animationFrames(250, 0)
            .start(function () {
              card.setSide('back')
            })
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

    card.intro = function (i, cb) {
      var delay = 500 + i * 10
      var z = i / 4

      $el.style[transform] = translate(-z + 'px', '-250px')
      $el.style.opacity = 0

      card.x = -z

      var yDiff = -z - -250

      animationFrames(delay, 1000)
        .start(function () {
          $el.style.zIndex = i
        })
        .progress(function (t) {
          $el.style.opacity = t
          t = ease.quartOut(t)
          card.y = -250 + yDiff * t
          $el.style[transform] = translate(-z + 'px', card.y + 'px')
        })
        .end(function () {
          $el.style.opacity = ''
          cb && cb(i)
        })
    }
  }
}
