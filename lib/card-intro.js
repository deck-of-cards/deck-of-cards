
import prefix from './prefix'

export default function (card, $el) {
  var transform = prefix('transform')
  var transition = prefix('transition')

  card.intro = function (i, cb) {
    var z = i / 5

    $el.style[transform] = 'translate(-' + z + 'px, -500%)'
    $el.style.opacity = 0
    $el.style[transition] = 'all 1s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
    $el.style.zIndex = i

    setTimeout(function () {
      $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)'
      $el.style.opacity = 1

      setTimeout(function () {
        $el.style[transition] = ''

        cb && cb(i)
      }, 1000)

    }, i * 10)
  }
}
