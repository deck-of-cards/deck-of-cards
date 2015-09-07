# HTML5 Deck of Cards
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/pakastin/deck-of-cards?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

Pure vanilla JS (+ CSS3) – no dependencies.

http://pakastin.github.io/deck-of-cards

## NOTICE!
Card graphics are now slightly modified from Chris Aguilar's awesome [Vector Playing Card Graphics Set](http://sourceforge.net/projects/vector-cards/). I want to respect author's license, and decided to change Deck of Cards license from MIT to LGPL. Sorry for any cause. Versions 0.0.x stay MIT. When theming is ready, I will put Vector Playing Card Graphics Set -theme to another repo, and change back to MIT. If you have something on your mind about this, please use this [issue](https://github.com/pakastin/deck-of-cards/issues/13). Thanks! 

Btw..if you're on iOS, try adding to home screen (via Safari's share button) - it should perform better ;)

## Latest changes
- 0.1.0 [Realistic face graphics](http://sourceforge.net/projects/vector-cards/)
- 0.0.4 winning mode, simpler shuffling, CSS box-shadow change
- 0.0.3 big refactoring – code now easier to follow and in smaller pieces
- 0.0.2 made intro shorter & added "poker"
- 0.0.1 initial version


## Download

- [Production version (~5 KB uncompressed)](https://pakastin.github.io/deck-of-cards/dist/deck.min.js)
- [Development version (~15 KB uncompressed)](https://pakastin.github.io/deck-of-cards/dist/deck.js)


## Where's what?

[css/](https://github.com/pakastin/deck-of-cards/tree/master/css) - CSS source (stylus + nib) of the example

[dist/](https://github.com/pakastin/deck-of-cards/tree/master/dist) - deck.js & deck.min.js

[example/](https://github.com/pakastin/deck-of-cards/tree/master/example) - http://pakastin.github.io/deck-of-cards

[lib/](https://github.com/pakastin/deck-of-cards/tree/master/lib) - JS (ES6) source of dist/deck.js - deck.js is also the main file

[views/](https://github.com/pakastin/deck-of-cards/tree/master/views) - HTML source of the example


## Build instructions

    npm install
    npm start

(starts watching for changes..)

## Note to self: todo

- Make z-index temporary by reordering DOM elements between actions
- Enhance API, make more flexible
- Make cards flippable

## License

- 0.1.x LGPL
- 0.0.x MIT
