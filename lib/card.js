
import Deck from './deck'

import createElement from './create-element'
import translate from './translate'
import prefix from './prefix'

var maxZ = 52

export default function (i) {
  var transition = prefix('transition')
  var transform = prefix('transform')
  var transformOrigin = prefix('transformOrigin')

  var rank = i % 13 + 1
  var name = rank === 1 ? 'A' : rank === 11 ? 'J' : rank === 12 ? 'Q' : rank === 13 ? 'K' : rank
  var suit = i / 13 | 0
  var z = (52 - i) / 4

  var $el = createElement('div')
  var $topleft = createElement('div')
  var $bottomright = createElement('div')
  var $face = createElement('div')
  var $back = createElement('div')

  var isMovable = false
  var isFlippable = false

  var self = {i, rank, suit, pos: i, $el, mount, unmount, setSide}

  var modules = Deck.modules
  var module

  $topleft.classList.add('topleft')
  $bottomright.classList.add('bottomright')
  $face.classList.add('face')
  $back.classList.add('back')

  $el.style.zIndex = 52 - i
  $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)'

  self.x = -z
  self.y = -z

  self.setSide('back')

  addListener($el, 'mousedown', onMousedown)
  addListener($el, 'touchstart', onMousedown)

  for (module in modules) {
    addModule(modules[module])
  }

  self.setRankSuit = function (rank, suit) {
    var suitName = SuitName(suit)
    $el.setAttribute('class', 'card ' + suitName + ' ' + (suitName + rank))
    $topleft.textContent = suit < 4 ? name : 'J\nO\nK\nE\nR'
    $bottomright.textContent = suit < 4 ? name : 'J\nO\nK\nE\nR'
  }

  self.setRankSuit(rank, suit)

  self.enableMoving = function () {
    if (isMovable) {
      // Already is movable, do nothing
      return
    }
    isMovable = true
    $el.style.cursor = 'move'
  }

  self.enableFlipping = function () {
    if (isFlippable) {
      return
    }
    isFlippable = true
  }

  self.disableFlipping = function () {
    if (!isFlippable) {
      return
    }
    isFlippable = false
  }

  self.disableMoving = function () {
    if (!isMovable) {
      // Already disabled moving, do nothing
      return
    }
    isMovable = false
    $el.style.cursor = ''
  }

  return self

  function addModule (module) {
    module.card && module.card(self)
  }

  function onMousedown (e) {
    var startPos = {}
    var pos = {}
    var starttime = Date.now()

    e.preventDefault()

    if (e.type === 'mousedown') {
      startPos.x = pos.x = e.clientX
      startPos.y = pos.y = e.clientY
      addListener(window, 'mousemove', onMousemove)
      addListener(window, 'mouseup', onMouseup)
    } else {
      startPos.x = pos.x = e.touches[0].clientX
      startPos.y = pos.y = e.touches[0].clientY
      addListener(window, 'touchmove', onMousemove)
      addListener(window, 'touchend', onMouseup)
    }

    if (!isMovable) {
      return
    }

    $el.style[transition] = 'all .2s'
    $el.style[transform] = translate(self.x + 'px', self.y + 'px')
    $el.style[transformOrigin] = '50% 50%'
    $el.style.zIndex = maxZ++

    function onMousemove (e) {
      if (!isMovable) {
        return
      }
      if (e.type === 'mousemove') {
        pos.x = e.clientX
        pos.y = e.clientY
      } else {
        pos.x = e.touches[0].clientX
        pos.y = e.touches[0].clientY
      }

      $el.style[transition] = ''
      $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px')
    }

    function onMouseup (e) {
      if (isFlippable && Date.now() - starttime < 200) {
        self.setSide(self.side === 'front' ? 'back' : 'front')
      }
      if (!isMovable) {
        return
      }
      if (e.type === 'mouseup') {
        removeListener(window, 'mousemove', onMousemove)
        removeListener(window, 'mouseup', onMouseup)
      } else {
        removeListener(window, 'touchmove', onMousemove)
        removeListener(window, 'touchend', onMouseup)
      }
      $el.style[transition] = ''

      self.x = self.x + pos.x - startPos.x
      self.y = self.y + pos.y - startPos.y
    }
  }

  function mount (target) {
    target.appendChild($el)

    self.$root = target
  }

  function unmount () {
    self.$root && self.$root.removeChild($el)
    self.$root = null
  }

  function setSide (newSide) {
    if (newSide === 'front') {
      if (self.side === 'back') {
        $el.removeChild($back)
      }
      self.side = 'front'
      $el.appendChild($face)
      $el.appendChild($topleft)
      $el.appendChild($bottomright)
      self.setRankSuit(self.rank, self.suit)
    } else {
      if (self.side === 'front') {
        $el.removeChild($face)
        $el.removeChild($topleft)
        $el.removeChild($bottomright)
      }
      self.side = 'back'
      $el.appendChild($back)
      $el.setAttribute('class', 'card')
    }
  }
}

function SuitName (suit) {
  return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker'
}

function addListener (target, name, listener) {
  target.addEventListener(name, listener)
}

function removeListener (target, name, listener) {
  target.removeEventListener(name, listener)
}
