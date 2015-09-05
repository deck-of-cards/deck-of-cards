
import translate from './translate'
import prefix from './prefix'
import plusMinus from './plusminus'

export default function (card, $el) {
  var transform = prefix('transform')
  var transition = prefix('transition')
  var transitionDelay = prefix('transitionDelay')

  card.shuffle = function (cb) {
    var i = card.pos
    var z = i / 4
    var offsetX = plusMinus(Math.random() * 40 + 30)
    var delay = i * 2

    $el.style[transition] = 'all .2s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
    $el.style[transitionDelay] = delay / 1000 + 's'

    setTimeout(function () {
      $el.style[transform] = translate(offsetX + '%', -z + 'px')
    }, 0)

    setTimeout(function () {
      $el.style[transitionDelay] = ''
      $el.style.zIndex = i
    }, 100 + delay)

    setTimeout(function () {
      $el.style[transform] = translate(-z + 'px', -z + 'px')

      setTimeout(function () {
        $el.style[transition] = ''
        cb(i)
      }, 200)

    }, 200 + delay)
  }
}
