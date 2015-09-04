
import createElement from './create-element'
import translate from './translate'
import prefix from './prefix'
import intro from './card-intro'
import shuffle from './card-shuffle'
import sort from './card-sort'
import bysuit from './card-bysuit'
import fan from './card-fan'
import poker from './card-poker'

export default function (i) {
  var transition = prefix('transition')
  var transform = prefix('transform')
  var maxZ = 52

  var value = i % 13 + 1
  var name = value === 1 ? 'A' : value === 11 ? 'J' : value === 12 ? 'Q' : value === 13 ? 'K' : value
  var suit = i / 13 | 0
  var suitsymbol = suitSymbol(suit)
  var color = (suit % 2) ? 'red' : 'black'
  var z = (52 - i) / 4
  var self = {i, value, suit, pos: i, $el, mount, unmount}

  var $el = createElement('div')
  var $suit = createElement('div')
  var $topleft = createElement('div')
  var $bottomright = createElement('div')

  var $root

  $el.classList.add('card', color)
  $suit.classList.add('suit')
  $topleft.classList.add('topleft')
  $bottomright.classList.add('bottomright')

  $suit.textContent = suitsymbol
  $topleft.innerHTML = name + '<br>' + suitsymbol
  $bottomright.innerHTML = name + '<br>' + suitsymbol

  $el.style.zIndex = 52 - i
  $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)'

  $el.appendChild($suit)
  $el.appendChild($topleft)
  $el.appendChild($bottomright)

  intro(self, $el)
  shuffle(self, $el)
  sort(self, $el)
  bysuit(self, $el)
  fan(self, $el)
  poker(self, $el)

  addListener($el, 'mousedown', onMousedown)
  addListener($el, 'touchstart', onMousedown)

  return self

  function onMousedown (e) {
    var middlePoint = $root.getBoundingClientRect()
    var pos = {}

    e.preventDefault()

    if (e.type === 'mousedown') {
      pos.x = e.clientX
      pos.y = e.clientY
      addListener(window, 'mousemove', onMousemove)
      addListener(window, 'mouseup', onMouseup)
    } else {
      pos.x = e.touches[0].clientX
      pos.y = e.touches[0].clientY
      addListener(window, 'touchmove', onMousemove)
      addListener(window, 'touchend', onMouseup)
    }

    $el.style[transition] = 'all .2s cubic-bezier(0.215, 0.610, 0.355, 1.000)'
    $el.style[transform] = translate((pos.x - middlePoint.left) + 'px', (pos.y - middlePoint.top) + 'px')
    $el.style.zIndex = maxZ++

    function onMousemove (e) {
      var pos = {}

      if (e.type === 'mousemove') {
        pos.x = e.clientX
        pos.y = e.clientY
      } else {
        pos.x = e.touches[0].clientX
        pos.y = e.touches[0].clientY
      }

      $el.style[transition] = ''
      $el.style[transform] = translate((pos.x - middlePoint.left) + 'px', (pos.y - middlePoint.top) + 'px')
    }

    function onMouseup (e) {
      if (e.type === 'mouseup') {
        removeListener(window, 'mousemove', onMousemove)
        removeListener(window, 'mouseup', onMouseup)
      } else {
        removeListener(window, 'touchmove', onMousemove)
        removeListener(window, 'touchend', onMouseup)
      }
    }
  }

  function mount (target) {
    target.appendChild($el)

    $root = target
  }

  function unmount () {
    $root && $root.removeChild($el)
    $root = null
  }
}

function suitSymbol (value) {
  return value === 0 ? '♠︎' : value === 1 ? '♥︎' : value === 2 ? '♣︎' : '♦'
}

function addListener (target, name, listener) {
  target.addEventListener(name, listener)
}

function removeListener (target, name, listener) {
  target.removeEventListener(name, listener)
}
