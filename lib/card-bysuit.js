
import translate from './translate'
import prefix from './prefix'

export default function (card, $el) {
  var transform = prefix('transform')
  var transition = prefix('transition')
  var transitionDelay = prefix('transitionDelay')

  var value = card.value
  var suit = card.suit

  card.bysuit = function (cb) {
    var i = card.i
    var delay = i * 10
    var posX = -(6.75 - value) * 15
    var posY = -(1.5 - suit) * 105

    setTimeout(function () {
      $el.style[transition] = 'all .5s cubic-bezier(0.645, 0.045, 0.355, 1.000)'
      $el.style[transitionDelay] = delay / 1000 + 's'
      $el.style[transform] = translate(posX + '%', posY + '%')
      $el.style.zIndex = i

      setTimeout(function () {
        $el.style[transition] = ''
        cb(i)
      }, 500 + delay)

    }, 0)
  }
}
