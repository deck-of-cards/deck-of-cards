
import prefix from './prefix'

var transition = prefix('transition')
var transform = prefix('transform')
var transformOrigin = prefix('transformOrigin')

export default function (card, $el) {
  card.fan = function (i, cb) {
    var z = i / 5
    var delay = i * 10
    var rot = i / 51 * 260 - 130
    $el.style[transformOrigin] = '50% 110%'
    setTimeout(function () {
      $el.style[transition] = '.3s all cubic-bezier(0.645, 0.045, 0.355, 1.000)'
      $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)'
      setTimeout(function () {
        $el.style[transform] = 'rotate(' + rot + 'deg)'
      }, 300)
    }, delay)
    $el.style.zIndex = i
    setTimeout(function () {
      cb(i)
    }, 1000 + delay)
  }
}
