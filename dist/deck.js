'use strict';

var Deck = (function () {
  'use strict';

  var flip = {
    deck: function deck(_deck) {
      _deck.flip = _deck.queued(flip);

      function flip(next) {
        var flipped = _deck.cards.filter(function (card) {
          return card.side === 'front';
        }).length / _deck.cards.length;

        _deck.cards.forEach(function (card, i) {
          card.setSide(flipped > 0.5 ? 'back' : 'front');
        });
        next();
      }
    }
  };

  var style = document.createElement('p').style;
  var memoized = {};

  function prefix(param) {
    if (typeof memoized[param] !== 'undefined') {
      return memoized[param];
    }

    if (typeof style[param] !== 'undefined') {
      memoized[param] = param;
      return param;
    }

    var camelCase = param[0].toUpperCase() + param.slice(1);
    var prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o'];
    var test;

    for (var i = 0, len = prefixes.length; i < len; i++) {
      test = prefixes[i] + camelCase;
      if (typeof style[test] !== 'undefined') {
        memoized[param] = test;
        return test;
      }
    }
  }

  var transform = prefix('transform');
  var $p = document.createElement('p');

  document.body.appendChild($p);

  $p.style[transform] = 'translate3d(1px,1px,1px)';

  var has3d = $p.style[transform];

  has3d = has3d != null && has3d.length && has3d !== 'none';

  document.body.removeChild($p);

  function translate(a, b, c) {
    c = c || 0;
    if (has3d) {
      return 'translate3d(' + a + ', ' + b + ', ' + c + ')';
    } else {
      return 'translate(' + a + ', ' + b + ')';
    }
  }

  var sort = {
    deck: function deck(_deck2) {
      _deck2.sort = _deck2.queued(sort);

      function sort(next, reverse) {
        var cards = _deck2.cards;

        cards.sort(function (a, b) {
          if (reverse) {
            return a.i - b.i;
          } else {
            return b.i - a.i;
          }
        });

        cards.forEach(function (card, i) {
          card.sort(i, function (i) {
            if (i === cards.length - 1) {
              next();
            }
          }, reverse);
        });
      }
    },
    card: function card(_card) {
      var transform = prefix('transform');
      var transition = prefix('transition');

      var $el = _card.$el;

      _card.sort = function (n, cb, reverse) {
        var z = n / 4;
        var delay = n * 10;

        setTimeout(function () {
          $el.style[transition] = 'all .4s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
          $el.style[transform] = translate(-z + 'px', '-150px');
          _card.x = -z;
          _card.y = -150;
        }, delay);

        setTimeout(function () {
          $el.style.zIndex = n;
        }, 200 + delay);

        setTimeout(function () {
          $el.style[transform] = translate(-z + 'px', -z + 'px');

          _card.x = -z;
          _card.y = -z;

          setTimeout(function () {
            $el.style[transition] = '';
            cb(n);
          }, 500);
        }, 400 + delay);
      };
    }
  };

  function plusMinus(value) {
    var plusminus = Math.round(Math.random()) ? -1 : 1;

    return plusminus * value;
  }

  function fisherYates(array) {
    var rnd, temp;

    for (var i = array.length - 1; i; i--) {
      rnd = Math.random() * i | 0;
      temp = array[i];
      array[i] = array[rnd];
      array[rnd] = temp;
    }

    return array;
  }

  function getFontSize() {
    return window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2);
  }

  var __fontSize;

  var shuffle = {
    deck: function deck(_deck3) {
      _deck3.shuffle = _deck3.queued(shuffle);

      function shuffle(next) {
        var cards = _deck3.cards;

        __fontSize = getFontSize();

        fisherYates(cards);

        cards.forEach(function (card, i) {
          card.pos = i;

          card.shuffle(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
        return;
      }
    },

    card: function card(_card2) {
      var transform = prefix('transform');
      var transition = prefix('transition');
      var transitionDelay = prefix('transition-delay');

      var $el = _card2.$el;

      _card2.shuffle = function (cb) {
        var i = _card2.pos;
        var z = i / 4;
        var offsetX = plusMinus(Math.random() * 40 + 20) * __fontSize / 16;
        var delay = i * 2;

        $el.style[transition] = 'all .2s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        $el.style[transitionDelay] = delay / 1000 + 's';

        setTimeout(function () {
          $el.style[transform] = translate(offsetX + 'px', -z + 'px');
          _card2.x = offsetX;
          _card2.y = -z;
        }, 0);

        setTimeout(function () {
          $el.style[transitionDelay] = '';
          $el.style.zIndex = i;
        }, 100 + delay);

        setTimeout(function () {
          $el.style[transform] = translate(-z + 'px', -z + 'px');

          _card2.x = -z;
          _card2.y = -z;

          setTimeout(function () {
            $el.style[transition] = '';
            cb(i);
          }, 200);
        }, 200 + delay);
      };
    }
  };

  var _fontSize;

  var poker = {
    deck: function deck(_deck4) {
      _deck4.poker = _deck4.queued(poker);

      function poker(next) {
        var cards = _deck4.cards;
        var len = cards.length;

        _fontSize = getFontSize();

        cards.slice(-5).reverse().forEach(function (card, i) {
          card.poker(i, len, function (i) {
            card.setSide('front');
            if (i === 4) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card3) {
      var transform = prefix('transform');
      var transition = prefix('transition');

      var $el = _card3.$el;

      _card3.poker = function (i, len, cb) {
        var delay = i * 250;
        var target = {
          x: Math.round((i - 2.05) * 70 * _fontSize / 16),
          y: Math.round(-110 * _fontSize / 16)
        };

        setTimeout(function () {
          $el.style.zIndex = len - 1 + i;
        }, delay);

        setTimeout(function () {
          $el.style[transition] = 'all .25s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
          $el.style[transform] = translate(target.x + 'px', target.y + 'px');

          _card3.x = target.x;
          _card3.y = target.y;
        }, delay + 25);

        setTimeout(function () {
          $el.style[transition] = '';
          cb(i);
        }, delay + 250);
      };
    }
  };

  var intro = {
    deck: function deck(_deck5) {
      _deck5.intro = _deck5.queued(intro);

      function intro(next) {
        var cards = _deck5.cards;

        cards.forEach(function (card, i) {
          card.setSide('front');
          card.intro(i, function (i) {
            setTimeout(function () {
              card.setSide('back');
            }, 500);
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card4) {
      var transform = prefix('transform');
      var transition = prefix('transition');
      var transitionDelay = prefix('transition-delay');

      var $el = _card4.$el;

      _card4.intro = function (i, cb) {
        var delay = i * 10 + 250;
        var z = i / 4;

        $el.style[transform] = translate(-z + 'px', '-250px');
        $el.style.opacity = 0;
        $el.style.zIndex = i;

        _card4.x = -z;
        _card4.y = -250;

        setTimeout(function () {
          $el.style[transition] = 'all 1s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
          $el.style[transitionDelay] = delay / 1000 + 's';
          $el.style[transform] = translate(-z + 'px', -z + 'px');
          $el.style.opacity = 1;

          _card4.x = -z;
          _card4.y = -z;

          setTimeout(function () {
            $el.style[transition] = '';

            cb && cb(i);
          }, 1250 + delay);
        }, 500);
      };
    }
  };

  var fan = {
    deck: function deck(_deck6) {
      _deck6.fan = _deck6.queued(fan);

      function fan(next) {
        var cards = _deck6.cards;
        var len = cards.length;

        cards.forEach(function (card, i) {
          card.fan(i, len, function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card5) {
      var transform = prefix('transform');
      var transformOrigin = prefix('transform-origin');
      var transition = prefix('transition');
      var transitionDelay = prefix('transition-delay');

      var $el = _card5.$el;

      _card5.fan = function (i, len, cb) {
        var z = i / 4;
        var delay = i * 10;
        var rot = i / (len - 1) * 260 - 130;

        $el.style[transformOrigin] = '50% 110%';

        setTimeout(function () {
          $el.style[transition] = 'all .3s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
          $el.style[transitionDelay] = delay / 1000 + 's';
          $el.style[transform] = translate(-z + 'px', -z + 'px');
          $el.style.zIndex = i;

          _card5.x = -z;
          _card5.y = -z;

          setTimeout(function () {
            $el.style[transitionDelay] = '';
            $el.style[transform] = translate(0, 0) + 'rotate(' + rot + 'deg)';
            _card5.x = 0;
            _card5.y = 0;
          }, 300 + delay);
        }, 0);

        setTimeout(function () {
          cb(i);
        }, 1000 + delay);
      };
    }
  };

  var fontSize;

  var bysuit = {
    deck: function deck(_deck7) {
      _deck7.bysuit = _deck7.queued(bysuit);

      function bysuit(next) {
        var cards = _deck7.cards;

        fontSize = getFontSize();

        cards.forEach(function (card) {
          card.bysuit(function (i) {
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card6) {
      var transform = prefix('transform');
      var transition = prefix('transition');
      var transitionDelay = prefix('transition-delay');

      var value = _card6.value;
      var suit = _card6.suit;

      var $el = _card6.$el;

      _card6.bysuit = function (cb) {
        var i = _card6.i;
        var delay = i * 10;
        var posX = -Math.round((6.75 - value) * 8 * fontSize / 16);
        var posY = -Math.round((1.5 - suit) * 92 * fontSize / 16);

        setTimeout(function () {
          $el.style[transition] = 'all .5s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
          $el.style[transitionDelay] = delay / 1000 + 's';
          $el.style[transform] = translate(posX + 'px', posY + 'px');
          $el.style.zIndex = i;

          _card6.x = posX;
          _card6.y = posY;

          setTimeout(function () {
            $el.style[transition] = '';
            cb(i);
          }, 500 + delay);
        }, 0);
      };
    }
  };

  function createElement(type) {
    return document.createElement(type);
  }

  var maxZ = 52;

  function Card(i) {
    var transition = prefix('transition');
    var transform = prefix('transform');
    var transformOrigin = prefix('transformOrigin');

    var rank = i % 13 + 1;
    var name = rank === 1 ? 'A' : rank === 11 ? 'J' : rank === 12 ? 'Q' : rank === 13 ? 'K' : rank;
    var suit = i / 13 | 0;
    var z = (52 - i) / 4;

    var $el = createElement('div');
    var $topleft = createElement('div');
    var $bottomright = createElement('div');
    var $face = createElement('div');
    var $back = createElement('div');

    var isMovable = false;
    var isFlippable = false;

    var self = { i: i, rank: rank, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount, setSide: setSide };

    var modules = Deck.modules;
    var module;

    $topleft.classList.add('topleft');
    $bottomright.classList.add('bottomright');
    $face.classList.add('face');
    $back.classList.add('back');

    $el.style.zIndex = 52 - i;
    $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)';

    self.x = -z;
    self.y = -z;

    self.setSide('back');

    addListener($el, 'mousedown', onMousedown);
    addListener($el, 'touchstart', onMousedown);

    for (module in modules) {
      addModule(modules[module]);
    }

    self.setRankSuit = function (rank, suit) {
      var suitName = SuitName(suit);
      $el.setAttribute('class', 'card ' + suitName + ' ' + (suitName + rank));
      $topleft.textContent = suit < 4 ? name : 'J\nO\nK\nE\nR';
      $bottomright.textContent = suit < 4 ? name : 'J\nO\nK\nE\nR';
    };

    self.setRankSuit(rank, suit);

    self.enableMoving = function () {
      if (isMovable) {
        // Already is movable, do nothing
        return;
      }
      isMovable = true;
      $el.style.cursor = 'move';
    };

    self.enableFlipping = function () {
      if (isFlippable) {
        return;
      }
      isFlippable = true;
    };

    self.disableFlipping = function () {
      if (!isFlippable) {
        return;
      }
      isFlippable = false;
    };

    self.disableMoving = function () {
      if (!isMovable) {
        // Already disabled moving, do nothing
        return;
      }
      isMovable = false;
      $el.style.cursor = '';
    };

    return self;

    function addModule(module) {
      module.card && module.card(self);
    }

    function onMousedown(e) {
      var startPos = {};
      var pos = {};
      var starttime = Date.now();

      e.preventDefault();

      if (e.type === 'mousedown') {
        startPos.x = pos.x = e.clientX;
        startPos.y = pos.y = e.clientY;
        addListener(window, 'mousemove', onMousemove);
        addListener(window, 'mouseup', onMouseup);
      } else {
        startPos.x = pos.x = e.touches[0].clientX;
        startPos.y = pos.y = e.touches[0].clientY;
        addListener(window, 'touchmove', onMousemove);
        addListener(window, 'touchend', onMouseup);
      }

      if (!isMovable) {
        return;
      }

      $el.style[transition] = 'all .2s';
      $el.style[transform] = translate(self.x + 'px', self.y + 'px');
      $el.style[transformOrigin] = '50% 50%';
      $el.style.zIndex = maxZ++;

      function onMousemove(e) {
        if (!isMovable) {
          return;
        }
        if (e.type === 'mousemove') {
          pos.x = e.clientX;
          pos.y = e.clientY;
        } else {
          pos.x = e.touches[0].clientX;
          pos.y = e.touches[0].clientY;
        }

        $el.style[transition] = '';
        $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px');
      }

      function onMouseup(e) {
        if (isFlippable && Date.now() - starttime < 200) {
          self.setSide(self.side === 'front' ? 'back' : 'front');
        }
        if (!isMovable) {
          return;
        }
        if (e.type === 'mouseup') {
          removeListener(window, 'mousemove', onMousemove);
          removeListener(window, 'mouseup', onMouseup);
        } else {
          removeListener(window, 'touchmove', onMousemove);
          removeListener(window, 'touchend', onMouseup);
        }
        $el.style[transition] = '';

        self.x = self.x + pos.x - startPos.x;
        self.y = self.y + pos.y - startPos.y;
      }
    }

    function mount(target) {
      target.appendChild($el);

      self.$root = target;
    }

    function unmount() {
      self.$root && self.$root.removeChild($el);
      self.$root = null;
    }

    function setSide(newSide) {
      if (newSide === 'front') {
        if (self.side === 'back') {
          $el.removeChild($back);
        }
        self.side = 'front';
        $el.appendChild($face);
        $el.appendChild($topleft);
        $el.appendChild($bottomright);
        self.setRankSuit(self.rank, self.suit);
      } else {
        if (self.side === 'front') {
          $el.removeChild($face);
          $el.removeChild($topleft);
          $el.removeChild($bottomright);
        }
        self.side = 'back';
        $el.appendChild($back);
        $el.setAttribute('class', 'card');
      }
    }
  }

  function SuitName(suit) {
    return suit === 0 ? 'spades' : suit === 1 ? 'hearts' : suit === 2 ? 'clubs' : suit === 3 ? 'diamonds' : 'joker';
  }

  function addListener(target, name, listener) {
    target.addEventListener(name, listener);
  }

  function removeListener(target, name, listener) {
    target.removeEventListener(name, listener);
  }

  function easing(name) {
    if (name === 'cubicInOut') {
      return 'cubic-bezier(0.645, 0.045, 0.355, 1.000)';
    }
  }

  function queue(target) {
    var array = Array.prototype;

    var queueing = [];

    target.queue = queue;
    target.queued = queued;

    return target;

    function queued(action) {
      return function () {
        var self = this;
        var args = arguments;

        queue(function (next) {
          action.apply(self, array.concat.apply(next, args));
        });
      };
    }

    function queue(action) {
      if (!action) {
        return;
      }

      queueing.push(action);

      if (queueing.length === 1) {
        next();
      }
    }
    function next() {
      queueing[0](function (err) {
        if (err) {
          throw err;
        }

        queueing = queueing.slice(1);

        if (queueing.length) {
          next();
        }
      });
    }
  }

  function observable(target) {
    target || (target = {});
    var listeners = {};

    target.on = on;
    target.one = one;
    target.off = off;
    target.trigger = trigger;

    return target;

    function on(name, cb, ctx) {
      listeners[name] || (listeners[name] = []);
      listeners[name].push({ cb: cb, ctx: ctx });
    }

    function one(name, cb, ctx) {
      listeners[name] || (listeners[name] = []);
      listeners[name].push({
        cb: cb, ctx: ctx, once: true
      });
    }

    function trigger(name) {
      var self = this;
      var args = Array.prototype.slice(arguments, 1);

      var currentListeners = listeners[name] || [];

      currentListeners.filter(function (listener) {
        listener.cb.apply(self, args);

        return !listener.once;
      });
    }

    function off(name, cb) {
      if (!name) {
        listeners = {};
        return;
      }

      if (!cb) {
        listeners[name] = [];
        return;
      }

      listeners[name] = listeners[name].filter(function (listener) {
        return listener.cb !== cb;
      });
    }
  }

  function Deck(jokers) {
    var cards = new Array(jokers ? 55 : 52);

    var $el = createElement('div');
    var self = observable({ mount: mount, unmount: unmount, cards: cards, $el: $el });
    var $root;

    var modules = Deck.modules;
    var module;

    queue(self);

    for (module in modules) {
      addModule(modules[module]);
    }

    $el.classList.add('deck');

    var card;

    for (var i = 0, len = cards.length; i < len; i++) {
      card = cards[i] = Card(i);
      card.mount($el);
    }

    return self;

    function mount(root) {
      $root = root;
      $root.appendChild($el);
    }

    function unmount() {
      $root.removeChild($el);
    }

    function addModule(module) {
      module.deck && module.deck(self);
    }
  }
  Deck.modules = { bysuit: bysuit, fan: fan, intro: intro, poker: poker, shuffle: shuffle, sort: sort, flip: flip };
  Deck.Card = Card;
  Deck.easing = easing;
  Deck.prefix = prefix;
  Deck.translate = translate;

  return Deck;
})();
