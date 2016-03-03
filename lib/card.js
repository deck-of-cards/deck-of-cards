
import Deck from './deck'

import animationFrames from './animationFrames'
import createElement from './createElement'
import Ease from './ease'
import translate from './translate'
import prefix from './prefix'

var maxZ = 52

export default function (i) {
  var transform = prefix('transform')

  // calculate rank/suit, etc..
  var rank = i % 13 + 1
  var suit = i / 13 | 0
  var z = (52 - i) / 4

  // create elements
  var $el = createElement('div')
  var $face = createElement('div')
  var $back = createElement('div')

  // states
  var isDraggable = false
  var isFlippable = false
  var isSelectable = false

  // self = card
  var self = {i, rank, suit, pos: i, $el, mount, unmount, setSide, selected: false}

  var modules = Deck.modules
  var module

  // add classes
  $face.classList.add('face')
  $back.classList.add('back')

  // add default transform
  $el.style[transform] = translate(-z + 'px', -z + 'px')

  // add default values
  self.x = -z
  self.y = -z
  self.z = z
  self.rot = 0

  // add drag/click listeners
  addListener($el, 'mousedown', onMousedown)
  addListener($el, 'touchstart', onMousedown)

  // load modules
  for (module in modules) {
    addModule(modules[module])
  }

  // set rank & suit
  self.paintCard = function () {
    var suitName = SuitName(self.suit)
    var selectedName = (self.selected) ? 'selected' : ''
    if (self.side === 'front') {
      $el.setAttribute('class', 'card ' + suitName + ' rank' + self.rank + ' ' + selectedName)
    } else if (self.side === 'back') {
      $el.setAttribute('class', 'card ' + selectedName)
    }
    if (isDraggable) {
      $el.style.cursor = 'move'
    } else if (isSelectable){
      $el.style.cursor = 'pointer'
    } else { 
      $el.style.cursor = 'default'
    }
  }

  // set default side to back and paint the card
  self.setSide('back')

  self.animateTo = function (params) {
    var {delay, duration, x = self.x, y = self.y, rot = self.rot, ease, onStart, onProgress, onComplete} = params
    var startX, startY, startRot
    var diffX, diffY, diffRot

    animationFrames(delay, duration)
      .start(function () {
        startX = self.x || 0
        startY = self.y || 0
        startRot = self.rot || 0
        onStart && onStart()
      })
      .progress(function (t) {
        var et = Ease[ease || 'cubicInOut'](t)

        diffX = x - startX
        diffY = y - startY
        diffRot = rot - startRot

        onProgress && onProgress(t, et)

        self.x = startX + diffX * et
        self.y = startY + diffY * et
        self.rot = startRot + diffRot * et

        $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (diffRot ? 'rotate(' + self.rot + 'deg)' : '')
      })
      .end(function () {
        onComplete && onComplete()
      })
  }

  self.enableDragging = function () {
    // this activates dragging
    if (isDraggable) {
      // already is draggable, do nothing
      return
    }
    isDraggable = true
    self.paintCard()
  }

  self.enableFlipping = function () {
    if (isFlippable) {
      // already is flippable, do nothing
      return
    }
    isFlippable = true
    self.paintCard()
  }

  self.enableSelecting = function () {
    if (isSelectable) {
      // already is Selectable, do nothing
      return
    }
    isSelectable = true
    self.paintCard()
  }

  self.disableFlipping = function () {
    if (!isFlippable) {
      // already disabled flipping, do nothing
      return
    }
    isFlippable = false
    self.paintCard()
  }

  self.disableDragging = function () {
    if (!isDraggable) {
      // already disabled dragging, do nothing
      return
    }
    isDraggable = false
    self.paintCard()
  }

  self.disableSelecting = function () {
    if (!isSelectable) {
      // already disabled selecting, do nothing
      return
    }
    isSelectable = false
    self.paintCard()
  }

  self.setSelected = function (newState) {
    if (isSelectable) {
      if (newState) {
        self.selected = true;
      } else {
        self.selected = false;
      }
      self.paintCard()
    }
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
      if (isSelectable && Date.now() - starttime < 200) {
        self.setSelected(!self.selected);
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
    } else {
      if (self.side === 'front') {
        $el.removeChild($face)
      }
      self.side = 'back'
      $el.appendChild($back)      
    }
    self.paintCard()
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
