
import createElement from './create-element'

import bysuit from './modules/bysuit'
import fan from './modules/fan'
import intro from './modules/intro'
import poker from './modules/poker'
import shuffle from './modules/shuffle'
import sort from './modules/sort'

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

  var modules = Deck.modules
  var module

  queue(self)

  for (module in modules) {
    addModule(modules[module])
  }

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

  function addModule (module) {
    module.deck && module.deck(self)
  }
}
Deck.modules = {bysuit, fan, intro, poker, shuffle, sort}
Deck.Card = Card
Deck.easing = easing
Deck.prefix = prefix
Deck.translate = translate
