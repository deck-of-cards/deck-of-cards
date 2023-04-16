# HTML5 Deck of Cards
[![Financial Contributors on Open Collective](https://opencollective.com/deck-of-cards/all/badge.svg?label=financial+contributors)](https://opencollective.com/deck-of-cards) [![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/pakastin/deck-of-cards?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

## NEW VERSION COMING UP!

The new **multiplayer** Deck of Cards is released at https://deck.of.cards, but will have its cards library open sourced soon here!

## Old version

Pure vanilla JS (+ CSS3) – no dependencies, by [Juha Lindstedt](https://github.com/pakastin) & [contributors](https://github.com/pakastin/deck-of-cards/graphs/contributors).

https://deck.of.cards/old

[Install from Google Chrome Web Store](https://chrome.google.com/webstore/detail/html5-deck-of-cards/ljafdfknpepklmkhomgaocmehgfdcpno)

Frontside card graphics are slightly modified from Chris Aguilar's awesome [Vector Playing Card Graphics Set](http://sourceforge.net/projects/vector-cards/).

Also check out my [RE:DOM](https://redom.js.org) and [HTML5 Node Garden](https://nodegarden.js.org) projects!

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/deck-of-cards/deck-of-cards/graphs/contributors"><img src="https://opencollective.com/deck-of-cards/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/deck-of-cards/contribute)]

#### Individuals

<a href="https://opencollective.com/deck-of-cards"><img src="https://opencollective.com/deck-of-cards/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/deck-of-cards/contribute)]

<a href="https://opencollective.com/deck-of-cards/organization/0/website"><img src="https://opencollective.com/deck-of-cards/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/deck-of-cards/organization/1/website"><img src="https://opencollective.com/deck-of-cards/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/deck-of-cards/organization/2/website"><img src="https://opencollective.com/deck-of-cards/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/deck-of-cards/organization/3/website"><img src="https://opencollective.com/deck-of-cards/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/deck-of-cards/organization/4/website"><img src="https://opencollective.com/deck-of-cards/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/deck-of-cards/organization/5/website"><img src="https://opencollective.com/deck-of-cards/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/deck-of-cards/organization/6/website"><img src="https://opencollective.com/deck-of-cards/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/deck-of-cards/organization/7/website"><img src="https://opencollective.com/deck-of-cards/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/deck-of-cards/organization/8/website"><img src="https://opencollective.com/deck-of-cards/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/deck-of-cards/organization/9/website"><img src="https://opencollective.com/deck-of-cards/organization/9/avatar.svg"></a>

## License

LGPL if you use Chris Aguilar's [vector playing cards](http://sourceforge.net/projects/vector-cards/). Otherwise MIT.

## Download

- [Production version (~5 KB uncompressed)](https://deck-of-cards.js.org/dist/deck.min.js)
- [Development version (~15 KB uncompressed)](https://deck-of-cards.js.org/dist/deck.js)

## Installation from npm
    npm install deck-of-cards

Then add in your html file

- In `<head>`:

``` html
<link rel="stylesheet" href="node_modules/deck-of-cards/example/example.css">
```

- At the end of the `<body>`:

``` html
<script src="node_modules/deck-of-cards/dist/deck.min.js"></script>
```


## Usage

### Full example

``` html
<html>
    <head>
        <title>Cards</title>

        <link rel="stylesheet" href="node_modules/deck-of-cards/example/example.css">
    </head>
    <body>
        <script src="node_modules/deck-of-cards/dist/deck.min.js"></script>

        <div id="container"></div>

        <script>
            var $container = document.getElementById('container');

            // create Deck
            var deck = Deck();

            // add to DOM
            deck.mount($container);

            deck.cards.forEach(function (card, i) {
                card.setSide(Math.random() < 0.5 ? 'front' : 'back');

                // explode
                card.animateTo({
                    delay: 1000 + i * 2, // wait 1 second + i * 2 ms
                    duration: 500,
                    ease: 'quartOut',

                    x: Math.random() * window.innerWidth - window.innerWidth / 2,
                    y: Math.random() * window.innerHeight - window.innerHeight / 2
                });
            });
        </script>
    </body>
</html>
```

Available on JsFiddle: http://jsfiddle.net/x0gjood1/


### Javascript API

#### Deck

``` js
// Instantiate a deck
var deck = Deck();

// display it in a html container
var $container = document.getElementById('container');
deck.mount($container);
```

Deck example: http://jsfiddle.net/ec4kcx1k/

``` js
// Flip all cards in deck
deck.flip();

// Sort cards
deck.sort();

// Shuffle
deck.shuffle();

// Display fan
deck.fan();

// Remove deck from html container, hide it
deck.unmount();
```

Shuffle cards and fan: http://jsfiddle.net/favbdkta/

Deck with jokers:

``` js
// Instantiate a deck with jokers
var deck = Deck(true);
```


#### Card

``` js
// Select the first card
var card = deck.cards[0];

// Add it to an html container
card.mount($container);

// Allow to move/drag it
card.enableDragging();
card.disableDragging();

// Allow to flip it
card.enableFlipping();
card.disableFlipping();

// Flip card
card.flip();

// Display card front or back
card.setSide('front');
card.setSide('back');
```

Draggable and flippable card: http://jsfiddle.net/cgz9mjts/


#### Card in deck

Remove a card from a deck

``` js
var deck = Deck();

// Remove 10 cards starting from the 6th
var removedCards = deck.cards.splice(5, 10);

removedCards.forEach(function (removedCard) {
    removedCard.unmount();
});
```

Deck without Clubs: http://jsfiddle.net/L25facxj/


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
