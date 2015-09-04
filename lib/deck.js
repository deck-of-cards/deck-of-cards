
import createElement from './create-element'
import Card from './card'
import shuffle from './deck-shuffle'
import observable from './observable'
import queue from './queue'

export default function () {
  var cards = new Array(52)
  var self = observable({mount, unmount, cards})

  var $el = createElement('div')
  var $root

  var card

  queue(self)
  shuffle(self, cards)

  self.sort = sort
  self.bysuit = bysuit
  self.poker = poker
  self.fan = fan

  $el.classList.add('deck')

  self.queue(function (next) {
    for (var i = 0, len = cards.length; i < len; i++) {
      card = cards[i] = Card(i)

      card.intro(i, function (i) {
        if (i === 51) {
          next()
        }
      })

      card.mount($el)
    }
  })

  self.sort()

  return self

  function mount (root) {
    $root = root
    $root.appendChild($el)
  }

  function unmount () {
    $root.removeChild($el)
  }

  function fan () {
    self.queue(function (next) {
      cards.forEach(function (card, i) {
        card.fan(i, function (i) {
          if (i === 51) {
            next()
          }
        })
      })
    })
  }

  function bysuit () {
    self.sort(true)
    self.queue(function (next) {
      cards.forEach(function (card) {
        card.bysuit(function (i) {
          if (i === 51) {
            next()
          }
        })
      })
    })
  }

  function poker () {
    self.shuffle()
    self.queue(function (next) {
      cards.slice(-5).reverse().forEach(function (card, i) {
        card.poker(i, function (i) {
          if (i === 4) {
            next()
          }
        })
      })
    })
  }

  function sort (reverse) {
    self.queue(function (cb) {
      cards.sort(function (a, b) {
        if (reverse) {
          return a.i - b.i
        } else {
          return b.i - a.i
        }
      })
      cards.forEach(function (card, i) {
        card.sort(i, function (i) {
          if (i === 51) {
            cb()
          }
        }, reverse)
      })
    })
  }
}
