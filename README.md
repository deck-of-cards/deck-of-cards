# HTML5 Deck of Cards
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/pakastin/deck-of-cards?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Pure vanilla JS (+ CSS3) – no dependencies, by [Juha Lindstedt](https://github.com/pakastin) & [contributors](https://github.com/pakastin/deck-of-cards/graphs/contributors).

https://deck-of-cards.js.org

[Install from Google Chrome Web Store](https://chrome.google.com/webstore/detail/html5-deck-of-cards/ljafdfknpepklmkhomgaocmehgfdcpno)

Frontside card graphics are slightly modified from Chris Aguilar's awesome [Vector Playing Card Graphics Set](http://sourceforge.net/projects/vector-cards/).

Also check out my [RE:DOM](https://redom.js.org) and [HTML5 Node Garden](https://nodegarden.js.org) projects!

## License

LGPL if you use Chris Aguilar's [vector playing cards](http://sourceforge.net/projects/vector-cards/). Otherwise MIT.

## Download

- [Production version (~5 KB uncompressed)](https://deck-of-cards.js.org/dist/deck.min.js)
- [Development version (~15 KB uncompressed)](https://deck-of-cards.js.org/dist/deck.js)

## Installation from npm
    npm install deck-of-cards

## Build instructions

    npm install
    npm start

(starts watching for changes..)

## Latest changes
- 0.1.4 card.animateTo() -method added –> simplier modules! [Simple example of usage](http://jsfiddle.net/x0gjood1/)
- 0.1.3 JS animations (instead of CSS transitions)
- 0.1.2 Backside graphics + setRankSuit (+ card.value -> card.rank!)
- 0.1.1 Better organized modules + Chrome app 
- 0.1.0 [Realistic face graphics](http://sourceforge.net/projects/vector-cards/), notice change of license for now..
- 0.0.4 winning mode, simpler shuffling, CSS box-shadow change
- 0.0.3 big refactoring – code now easier to follow and in smaller pieces
- 0.0.2 made intro shorter & added "poker"
- 0.0.1 initial version


## Where's what?

[css/](https://github.com/pakastin/deck-of-cards/tree/master/css) - CSS source (stylus + nib) of the example

[chrome/](https://github.com/pakastin/deck-of-cards/tree/master/chrome) - [Chrome Web Store app](https://chrome.google.com/webstore/detail/html5-deck-of-cards/ljafdfknpepklmkhomgaocmehgfdcpno) source

[dist/](https://github.com/pakastin/deck-of-cards/tree/master/dist) - deck.js & deck.min.js

[example/](https://github.com/pakastin/deck-of-cards/tree/master/example) - https://deck-of-cards.js.org

[lib/](https://github.com/pakastin/deck-of-cards/tree/master/lib) - JS (ES6) source of dist/deck.js - deck.js is also the main file

[views/](https://github.com/pakastin/deck-of-cards/tree/master/views) - HTML source of the example


## Note to self: todo

- Make z-index temporary by reordering DOM elements between actions
- Enhance API, make more flexible


## Featured on
- https://reddit.com/r/InternetIsBeautiful/comments/3jmq97/html5_deck_of_cards/
- https://news.ycombinator.com/item?id=10164513
- http://tympanus.net/codrops/collective/collective-184/
- https://github.com/trending?since=weekly
- https://twitter.com/fwa/status/639719192158171136
- https://twitter.com/search?q=%22html5+deck+of+cards%22
- https://theslackpost.com/tmpg
- http://news.js.org/
- http://boredmachine.com/go/rKv6A
- http://www.moongift.jp/2015/09/html5-deck-of-cards-html5%E8%A3%BD%E3%81%AE%E3%83%88%E3%83%A9%E3%83%B3%E3%83%97/
- http://www.blogduwebdesign.com/ressources-jeux/ressourcescreer-manipuler-cartes-HTML-Javascript-nodejs-Ruby/1933
- http://fex.baidu.com/blog/2015/09/fex-weekly-07/
