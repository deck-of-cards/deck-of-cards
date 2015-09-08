'use strict';

var Deck = (function () {
  'use strict';

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
    deck: function deck(_deck) {
      _deck.sort = _deck.queued(sort);

      function sort(next, reverse) {
        var cards = _deck.cards;

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
          $el.style[transform] = translate(-z + 'px', '-150%');
        }, delay);

        setTimeout(function () {
          $el.style.zIndex = n;
        }, 200 + delay);

        setTimeout(function () {
          $el.style[transform] = translate(-z + 'px', -z + 'px');

          setTimeout(function () {
            $el.style[transition] = '';
            _card.x = -z;
            _card.y = -z;
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

  var shuffle = {
    deck: function deck(_deck2) {
      _deck2.shuffle = _deck2.queued(shuffle);

      function shuffle(next) {
        var cards = _deck2.cards;

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
      var transitionDelay = prefix('transitionDelay');

      var $el = _card2.$el;

      _card2.shuffle = function (cb) {
        var i = _card2.pos;
        var z = i / 4;
        var offsetX = plusMinus(Math.random() * 40 + 30);
        var delay = i * 2;

        $el.style[transition] = 'all .2s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        $el.style[transitionDelay] = delay / 1000 + 's';

        setTimeout(function () {
          $el.style[transform] = translate(offsetX + '%', -z + 'px');
        }, 0);

        setTimeout(function () {
          $el.style[transitionDelay] = '';
          $el.style.zIndex = i;
        }, 100 + delay);

        setTimeout(function () {
          $el.style[transform] = translate(-z + 'px', -z + 'px');

          setTimeout(function () {
            $el.style[transition] = '';
            cb(i);
          }, 200);
        }, 200 + delay);
      };
    }
  };

  var poker = {
    deck: function deck(_deck3) {
      _deck3.poker = _deck3.queued(poker);

      function poker(next) {
        var cards = _deck3.cards;
        var len = cards.length;

        cards.slice(-5).reverse().forEach(function (card, i) {
          card.poker(i, len, function (i) {
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
          x: (i - 2.05) * 110,
          y: -125
        };

        setTimeout(function () {
          $el.style.zIndex = len - 1 + i;
        }, delay);

        setTimeout(function () {
          $el.style[transition] = 'all .25s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
          $el.style[transform] = translate(target.x + '%', target.y + '%');
        }, delay + 25);

        setTimeout(function () {
          $el.style[transition] = '';
          cb(i);
        }, delay + 250);
      };
    }
  };

  var intro = {
    deck: function deck(_deck4) {
      _deck4.intro = _deck4.queued(intro);

      function intro(next) {
        var cards = _deck4.cards;

        cards.forEach(function (card, i) {
          card.intro(i, function (i) {
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
      var transitionDelay = prefix('transitionDelay');

      var $el = _card4.$el;

      _card4.intro = function (i, cb) {
        var delay = i * 10 + 250;
        var z = i / 4;

        $el.style[transform] = translate(-z + 'px', '-250%');
        $el.style.opacity = 0;
        $el.style.zIndex = i;

        setTimeout(function () {
          $el.style[transition] = 'all 1s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
          $el.style[transitionDelay] = delay / 1000 + 's';
          $el.style[transform] = translate(-z + 'px', -z + 'px');
          $el.style.opacity = 1;

          setTimeout(function () {
            $el.style[transition] = '';

            cb && cb(i);
          }, 1250 + delay);
        }, 500);
      };
    }
  };

  var fan = {
    deck: function deck(_deck5) {
      _deck5.fan = _deck5.queued(fan);

      function fan(next) {
        var cards = _deck5.cards;
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
      var transformOrigin = prefix('transformOrigin');
      var transition = prefix('transition');
      var transitionDelay = prefix('transitionDelay');

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

          setTimeout(function () {
            $el.style[transitionDelay] = '';
            $el.style[transform] = translate(0, 0) + 'rotate(' + rot + 'deg)';
          }, 300 + delay);
        }, 0);

        setTimeout(function () {
          cb(i);
        }, 1000 + delay);
      };
    }
  };

  var bysuit = {
    deck: function deck(_deck6) {
      _deck6.bysuit = _deck6.queued(bysuit);

      function bysuit(next) {
        var cards = _deck6.cards;

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
      var transitionDelay = prefix('transitionDelay');

      var value = _card6.value;
      var suit = _card6.suit;

      var $el = _card6.$el;

      _card6.bysuit = function (cb) {
        var i = _card6.i;
        var delay = i * 10;
        var posX = -(6.75 - value) * 15;
        var posY = -(1.5 - suit) * 105;

        setTimeout(function () {
          $el.style[transition] = 'all .5s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
          $el.style[transitionDelay] = delay / 1000 + 's';
          $el.style[transform] = translate(posX + '%', posY + '%');
          $el.style.zIndex = i;

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

    var value = i % 13 + 1;
    var name = value === 1 ? 'A' : value === 11 ? 'J' : value === 12 ? 'Q' : value === 13 ? 'K' : value;
    var suit = i / 13 | 0;
    var suitName = SuitName(suit);
    var z = (52 - i) / 4;

    var $el = createElement('div');
    var $topleft = createElement('div');
    var $bottomright = createElement('div');
    var $face = createElement('div');

    var isMovable = false;

    var self = { i: i, value: value, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount };

    var modules = Deck.modules;
    var module;

    $el.classList.add('card', suitName, suitName + value);
    $topleft.classList.add('topleft');
    $bottomright.classList.add('bottomright');
    $face.classList.add('face');

    $topleft.textContent = suit < 4 ? name : 'J\nO\nK\nE\nR';
    $bottomright.textContent = suit < 4 ? name : 'J\nO\nK\nE\nR';

    $el.style.zIndex = 52 - i;
    $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)';

    $el.appendChild($face);
    $el.appendChild($topleft);
    $el.appendChild($bottomright);

    for (module in modules) {
      addModule(modules[module]);
    }

    self.enableMoving = function () {
      if (isMovable) {
        // Already is movable, do nothing
        return;
      }
      $el.style.cursor = 'move';
      addListener($el, 'mousedown', onMousedown);
      addListener($el, 'touchstart', onMousedown);
    };

    self.disableMoving = function () {
      if (!isMovable) {
        // Already disabled moving, do nothing
        return;
      }
      $el.style.cursor = '';
      removeListener($el, 'mousedown', onMousedown);
      removeListener($el, 'touchstart', onMousedown);
    };

    return self;

    function addModule(module) {
      module.card && module.card(self);
    }

    function onMousedown(e) {
      var middlePoint = self.$root.getBoundingClientRect();
      var pos = {};

      e.preventDefault();

      if (e.type === 'mousedown') {
        pos.x = e.clientX;
        pos.y = e.clientY;
        addListener(window, 'mousemove', onMousemove);
        addListener(window, 'mouseup', onMouseup);
      } else {
        pos.x = e.touches[0].clientX;
        pos.y = e.touches[0].clientY;
        addListener(window, 'touchmove', onMousemove);
        addListener(window, 'touchend', onMouseup);
      }

      $el.style[transition] = 'all .2s cubic-bezier(0.215, 0.610, 0.355, 1.000)';
      $el.style[transform] = translate(pos.x - middlePoint.left + 'px', pos.y - middlePoint.top + 'px');
      $el.style.zIndex = maxZ++;

      function onMousemove(e) {
        var pos = {};

        if (e.type === 'mousemove') {
          pos.x = e.clientX;
          pos.y = e.clientY;
        } else {
          pos.x = e.touches[0].clientX;
          pos.y = e.touches[0].clientY;
        }

        $el.style[transition] = '';
        $el.style[transform] = translate(pos.x - middlePoint.left + 'px', pos.y - middlePoint.top + 'px');
      }

      function onMouseup(e) {
        if (e.type === 'mouseup') {
          removeListener(window, 'mousemove', onMousemove);
          removeListener(window, 'mouseup', onMouseup);
        } else {
          removeListener(window, 'touchmove', onMousemove);
          removeListener(window, 'touchend', onMouseup);
        }
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
  }

  function SuitName(value) {
    return value === 0 ? 'spades' : value === 1 ? 'hearts' : value === 2 ? 'clubs' : value === 3 ? 'diamonds' : 'joker';
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
  Deck.modules = { bysuit: bysuit, fan: fan, intro: intro, poker: poker, shuffle: shuffle, sort: sort };
  Deck.Card = Card;
  Deck.easing = easing;
  Deck.prefix = prefix;
  Deck.translate = translate;

  return Deck;
})();
