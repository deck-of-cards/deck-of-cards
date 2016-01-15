
import createElement from './createElement'

import animationFrames from './animationFrames'
import ease from './ease'
import bysuit from './modules/bysuit'
import fan from './modules/fan'
import intro from './modules/intro'
import poker from './modules/poker'
import shuffle from './modules/shuffle'
import sort from './modules/sort'
import flip from './modules/flip'

import observable from './observable'
import queue from './queue'
import prefix from './prefix'
import translate from './translate'

import Card from './card'

// The Deck constructor accepts three kinds of arguments:
// 1. A dictionary of the form {jokers: <boolean>, numDecks: <num decks>}
// 2. A single boolean value (jokers)
// 3. Either of 1. or 2. with some argument missing (default values are used: no jokers, 1 deck)
export default function Deck (arg0) {
  // Arguments and their default values
  var args;

  // Default to 1 deck, no jokers
  arg0 = arg0 || false;

  if (typeof(arg0) === 'boolean') {
    // For backwards compatibility with previous versions, still accept a boolean indicating jokers or not
    args = {jokers: arg0, numDecks: 1};
  } else {
    // map: {jokers: ..., numDecks: ...}
    args = arg0 || {};
    args.jokers = args.jokers || false;
    args.numDecks = args.numDecks || 1;
  }

  // init cards array
  var cardsPerDeck = (args.jokers ? 55 : 52)
  var cards = new Array(args.numDecks * cardsPerDeck)

  var $el = createElement('div')
  var self = observable({mount, unmount, cards, $el})
  var $root

  var modules = Deck.modules
  var module

  // make queueable
  queue(self)

  // load modules
  for (module in modules) {
    addModule(modules[module])
  }

  // add class
  $el.classList.add('deck')

  var card

  // create cards
  for ( var j = 0; j < args.numDecks; j++) {
    for (var i = 1; i <= cardsPerDeck; i++) {
      cards[j*cardsPerDeck+i-1] = card = Card(i-1)
      card.mount($el)
    }
  }

  return self

  function mount (root) {
    // mount deck to root
    $root = root
    $root.appendChild($el)
  }

  function unmount () {
    // unmount deck from root
    $root.removeChild($el)
  }

  function addModule (module) {
    module.deck && module.deck(self)
  }
}
Deck.animationFrames = animationFrames
Deck.ease = ease
Deck.modules = {bysuit, fan, intro, poker, shuffle, sort, flip}
Deck.Card = Card
Deck.prefix = prefix
Deck.translate = translate
