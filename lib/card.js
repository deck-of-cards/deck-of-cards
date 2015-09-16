
import Deck from './deck'

import createElement from './create-element'
import translate from './translate'
import prefix from './prefix'

var maxZ = 52

export default function (i) {
  var transform = prefix('transform')

  // calculate rank/suit, etc..
  var rank = i % 13 + 1
  var name = rank === 1 ? 'A' : rank === 11 ? 'J' : rank === 12 ? 'Q' : rank === 13 ? 'K' : rank
  var suit = i / 13 | 0
  var z = (52 - i) / 4

  // create elements
  var $el = createElement('div')
  var $topleft = createElement('div')
  var $bottomright = createElement('div')
  var $face = createElement('div')
  var $back = createElement('div')

  // states
  var isDraggable = false
  var isFlippable = false

  // self = card
  var self = {i, rank, suit, pos: i, $el, mount, unmount, setSide}

  var modules = Deck.modules
  var module

  // add classes
  $topleft.classList.add('topleft')
  $bottomright.classList.add('bottomright')
  $face.classList.add('face')
  $back.classList.add('back')

  // add default transform
  $el.style[transform] = translate(-z + 'px', -z + 'px')

  // add default values
  self.x = -z
  self.y = -z
  self.z = z
  self.rot = 0

  // set default side to back
  self.setSide('back')

  // add drag/click listeners
  addListener($el, 'mousedown', onMousedown)
  addListener($el, 'touchstart', onMousedown)

  // load modules
  for (module in modules) {
    addModule(modules[module])
  }

  // set rank & suit
  self.setRankSuit = function (rank, suit) {
    var suitName = SuitName(suit)
    $el.setAttribute('class', 'card ' + suitName + ' ' + (suitName + rank))
    $topleft.textContent = suit < 4 ? name : 'J\nO\nK\nE\nR'
    $bottomright.textContent = suit < 4 ? name : 'J\nO\nK\nE\nR'
  }

  self.setRankSuit(rank, suit)

  self.enableDragging = function () {
    // this activates dragging
    if (isDraggable) {
      // already is draggable, do nothing
      return
    }
    isDraggable = true
    $el.style.cursor = 'move'
  }

  self.enableFlipping = function () {
    if (isFlippable) {
      // already is flippable, do nothing
      return
    }
    isFlippable = true
  }

  self.disableFlipping = function () {
    if (!isFlippable) {
      // already disabled flipping, do nothing
      return
    }
    isFlippable = false
  }

  self.disableDragging = function () {
    if (!isDraggable) {
      // already disabled dragging, do nothing
      return
    }
    isDraggable = false
    $el.style.cursor = ''
  }

  return self

  function addModule (module) {
    // add card module
    module.card && module.card(self)
  }

  function onMousedown (e) {
    var startPos = {}
    var pos = {}
    var starttime = Date.now()

    e.preventDefault()

    // get start coordinates and start listening window events
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

    if (!isDraggable) {
      // is not draggable, do nothing
      return
    }

    // move card
    $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '')
    $el.style.zIndex = maxZ++

    function onMousemove (e) {
      if (!isDraggable) {
        // is not draggable, do nothing
        return
      }
      if (e.type === 'mousemove') {
        pos.x = e.clientX
        pos.y = e.clientY
      } else {
        pos.x = e.touches[0].clientX
        pos.y = e.touches[0].clientY
      }

      // move card
      $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '')
    }

    function onMouseup (e) {
      if (isFlippable && Date.now() - starttime < 200) {
        // flip sides
        self.setSide(self.side === 'front' ? 'back' : 'front')
      }
      if (e.type === 'mouseup') {
        removeListener(window, 'mousemove', onMousemove)
        removeListener(window, 'mouseup', onMouseup)
      } else {
        removeListener(window, 'touchmove', onMousemove)
        removeListener(window, 'touchend', onMouseup)
      }
      if (!isDraggable) {
        // is not draggable, do nothing
        return
      }

      // set current position
      self.x = self.x + pos.x - startPos.x
      self.y = self.y + pos.y - startPos.y
    }
  }

  function mount (target) {
    // mount card to target (deck)
    target.appendChild($el)

    self.$root = target
  }

  function unmount () {
    // unmount from root (deck)
    self.$root && self.$root.removeChild($el)
    self.$root = null
  }

  function setSide (newSide) {
    // flip sides
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
  // return suit name from suit value
  return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker'
}

function addListener (target, name, listener) {
  target.addEventListener(name, listener)
}

function removeListener (target, name, listener) {
  target.removeEventListener(name, listener)
}
