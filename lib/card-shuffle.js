
import prefix from './prefix'
import plusMinus from './plusminus'


var transform = prefix('transform')
var transition = prefix('transition')

export default function (card, $el) {
  card.shuffle = function (n, cb) {
    var i = card.pos
    var z = i / 5
    var offsetX = plusMinus(Math.random() * 40 + 30)
    var delay = i * 2

    $el.style[transition] = 'all .3s cubic-bezier(0.645, 0.045, 0.355, 1.000)'

    setTimeout(function () {
      $el.style[transform] = 'translate(' + offsetX + '%, -' + z + 'px)'
    }, delay)

    setTimeout(function () {
      $el.style.zIndex = i
    }, 150 + delay)

    setTimeout(function () {
      $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)'

      setTimeout(function () {
        n || ($el.style[transition] = '')
        cb(i)
      }, n ? 100 : 300)

    }, 300 + delay)
  }
}
