
import createElement from './create-element'

import shuffleModule from './deck-shuffle'
import fanModule from './deck-fan'
import sortModule from './deck-sort'
import pokerModule from './deck-poker'
import bysuitModule from './deck-bysuit'
import introModule from './deck-intro'

import observable from './observable'
import queue from './queue'
import prefix from './prefix'
import translate from './translate'
import easing from './easing'

import Card from './card'

export default function Deck (jokers) {
  var cards = new Array(jokers ? 55 : 52)

  var $el = createElement('div')
  var self = observable({mount, unmount, cards, $el})
  var $root

  queue(self)
  shuffleModule(self)
  sortModule(self)
  fanModule(self)
  pokerModule(self)
  bysuitModule(self)
  introModule(self)

  $el.classList.add('deck')

  var card

  for (var i = 0, len = cards.length; i < len; i++) {
    card = cards[i] = Card(i)
    card.mount($el)
  }

  return self

  function mount (root) {
    $root = root
    $root.appendChild($el)
  }

  function unmount () {
    $root.removeChild($el)
  }
}
Deck.Card = Card
Deck.easing = easing
Deck.prefix = prefix
Deck.translate = translate
