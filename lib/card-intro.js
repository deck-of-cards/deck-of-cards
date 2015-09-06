
import translate from './translate'
import prefix from './prefix'

export default function (card, $el) {
  var transform = prefix('transform')
  var transition = prefix('transition')
  var transitionDelay = prefix('transitionDelay')

  card.intro = function (i, cb) {
    var delay = i * 10 + 250
    var z = i / 4

    $el.style[transform] = translate(-z + 'px', '-250%')
    $el.style.opacity = 0
    $el.style.zIndex = i

    setTimeout(function () {
      $el.style[transition] = 'all 1s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
      $el.style[transitionDelay] = delay / 1000 + 's'
      $el.style[transform] = translate(-z + 'px', -z + 'px')
      $el.style.opacity = 1

      setTimeout(function () {
        $el.style[transition] = ''

        cb && cb(i)
      }, 1250 + delay)
    }, 500)
  }
}
