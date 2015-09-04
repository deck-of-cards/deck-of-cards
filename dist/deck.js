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

  function poker(card, $el) {
    var transform = prefix('transform');
    var transition = prefix('transition');
    var transitionDelay = prefix('transitionDelay');

    card.poker = function (i, cb) {
      var delay = i * 250;
      var target = {
        x: (i - 2) * 110,
        y: -125
      };
      setTimeout(function () {
        $el.style[transition] = 'all .25s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        $el.style[transitionDelay] = delay / 1000 + 's';
        $el.style[transform] = 'translate(' + target.x + '%, ' + target.y + '%)';
      }, 0);
      setTimeout(function () {
        $el.style[transition] = '';
        cb(i);
      }, delay + 250);
    };
  }

  function fan(card, $el) {
    var transform = prefix('transform');
    var transformOrigin = prefix('transformOrigin');
    var transition = prefix('transition');
    var transitionDelay = prefix('transitionDelay');

    card.fan = function (i, cb) {
      var z = i / 5;
      var delay = i * 10;
      var rot = i / 51 * 260 - 130;

      $el.style[transformOrigin] = '50% 110%';

      setTimeout(function () {
        $el.style[transition] = '.3s all cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        $el.style[transitionDelay] = delay / 1000 + 's';
        $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)';

        setTimeout(function () {
          $el.style[transitionDelay] = '';
          $el.style[transform] = 'rotate(' + rot + 'deg)';
        }, 300 + delay);
      }, 0);

      $el.style.zIndex = i;

      setTimeout(function () {
        cb(i);
      }, 1000 + delay);
    };
  }

  function bysuit(card, $el) {
    var transform = prefix('transform');
    var transition = prefix('transition');
    var transitionDelay = prefix('transitionDelay');

    var value = card.value;
    var suit = card.suit;

    card.bysuit = function (cb) {
      var i = card.i;
      var delay = i * 10;
      var posX = -(7 - value) * 20;
      var posY = -(1.5 - suit) * 105;

      setTimeout(function () {
        $el.style[transition] = 'all .5s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        $el.style[transitionDelay] = delay / 1000 + 's';
        $el.style[transform] = 'translate(' + posX + '%,' + posY + '%)';
        $el.style.zIndex = i;

        setTimeout(function () {
          $el.style[transition] = '';
          cb(i);
        }, 500 + delay);
      }, 0);
    };
  }

  function sort(card, $el) {
    var transform = prefix('transform');
    var transition = prefix('transition');

    card.sort = function (n, cb, reverse) {
      var z = n / 5;
      var delay = n * 10;

      setTimeout(function () {
        $el.style[transition] = 'all .4s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        $el.style[transform] = 'translate(-' + z + 'px, -150%)';
      }, delay);

      setTimeout(function () {
        $el.style.zIndex = n;
      }, 200 + delay);

      setTimeout(function () {
        $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)';

        setTimeout(function () {
          $el.style[transition] = '';
          card.x = -z;
          card.y = -z;
          cb(n);
        }, 500);
      }, 400 + delay);
    };
  }

  function plusMinus(value) {
    var plusminus = Math.round(Math.random()) ? -1 : 1;

    return plusminus * value;
  }

  function shuffle(card, $el) {
    var transform = prefix('transform');
    var transition = prefix('transition');
    var transitionDelay = prefix('transitionDelay');

    card.shuffle = function (n, cb) {
      var i = card.pos;
      var z = i / 5;
      var offsetX = plusMinus(Math.random() * 40 + 30);
      var delay = i * 2;

      $el.style[transition] = 'all .25s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
      $el.style[transitionDelay] = delay / 1000 + 's';

      setTimeout(function () {
        $el.style[transform] = 'translate(' + offsetX + '%, -' + z + 'px)';
      }, 0);

      setTimeout(function () {
        $el.style[transitionDelay] = '';
        $el.style.zIndex = i;
      }, 125 + delay);

      setTimeout(function () {
        $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)';

        setTimeout(function () {
          n || ($el.style[transition] = '');
          cb(i);
        }, 250);
      }, 250 + delay);
    };
  }

  function intro(card, $el) {
    var transform = prefix('transform');
    var transition = prefix('transition');
    var transitionDelay = prefix('transitionDelay');

    card.intro = function (i, cb) {
      var delay = i * 10 + 250;
      var z = i / 5;

      $el.style[transform] = 'translate(-' + z + 'px, -250%)';
      $el.style.opacity = 0;
      $el.style.zIndex = i;

      setTimeout(function () {
        $el.style[transition] = 'all 1s cubic-bezier(0.645, 0.045, 0.355, 1.000)';
        $el.style[transitionDelay] = delay / 1000 + 's';
        $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)';
        $el.style.opacity = 1;

        setTimeout(function () {
          $el.style[transition] = '';

          cb && cb(i);
        }, 1250 + delay);
      }, 0);
    };
  }

  function createElement(type) {
    return document.createElement(type);
  }

  function Card(i) {
    var transition = prefix('transition');
    var transform = prefix('transform');
    var maxZ = 52;

    var value = i % 13 + 1;
    var name = value === 1 ? 'A' : value === 11 ? 'J' : value === 12 ? 'Q' : value === 13 ? 'K' : value;
    var suit = i / 13 | 0;
    var suitsymbol = suitSymbol(suit);
    var color = suit % 2 ? 'red' : 'black';
    var z = (52 - i) / 5;
    var self = { i: i, value: value, suit: suit, pos: i, $el: $el, mount: mount, unmount: unmount };

    var $el = createElement('div');
    var $suit = createElement('div');
    var $topleft = createElement('div');
    var $bottomright = createElement('div');

    var $root;

    $el.classList.add('card', color);
    $suit.classList.add('suit');
    $topleft.classList.add('topleft');
    $bottomright.classList.add('bottomright');

    $suit.textContent = suitsymbol;
    $topleft.innerHTML = name + '<br>' + suitsymbol;
    $bottomright.innerHTML = name + '<br>' + suitsymbol;

    $el.style.zIndex = 52 - i;
    $el.style[transform] = 'translate(-' + z + 'px, -' + z + 'px)';

    $el.appendChild($suit);
    $el.appendChild($topleft);
    $el.appendChild($bottomright);

    intro(self, $el);
    shuffle(self, $el);
    sort(self, $el);
    bysuit(self, $el);
    fan(self, $el);
    poker(self, $el);

    addListener($el, 'mousedown', onMousedown);
    addListener($el, 'touchstart', onMousedown);

    return self;

    function onMousedown(e) {
      var middlePoint = $root.getBoundingClientRect();

      if (e.type === 'mousedown') {
        addListener(window, 'mousemove', onMousemove);
        addListener(window, 'mouseup', onMouseup);
      } else {
        addListener(window, 'touchmove', onMousemove);
        addListener(window, 'touchend', onMouseup);
      }

      $el.style[transition] = '';

      function onMousemove(e) {
        var pos = {};

        if (e.type === 'mousemove') {
          pos.x = e.clientX;
          pos.y = e.clientY;
        } else {
          pos.x = e.touches[0].clientX;
          pos.y = e.touches[0].clientY;
        }

        $el.style[transform] = 'translate(' + (pos.x - middlePoint.left) + 'px, ' + (pos.y - middlePoint.top) + 'px)';
      }

      function onMouseup(e) {
        if (e.type === 'mouseup') {
          removeListener(window, 'mousemove', onMousemove);
          removeListener(window, 'mouseup', onMouseup);
        } else {
          removeListener(window, 'touchmove', onMousemove);
          removeListener(window, 'touchend', onMouseup);
        }

        $el.style.zIndex = maxZ++;
      }
    }

    function mount(target) {
      target.appendChild($el);

      $root = target;
    }

    function unmount() {
      $root && $root.removeChild($el);
      $root = null;
    }
  }

  function suitSymbol(value) {
    return value === 0 ? '♠︎' : value === 1 ? '♥︎' : value === 2 ? '♣︎' : '♦';
  }

  function addListener(target, name, listener) {
    target.addEventListener(name, listener);
  }

  function removeListener(target, name, listener) {
    target.removeEventListener(name, listener);
  }

  function shuffleable(deck, cards) {
    var shuffling = -1;

    deck.shuffle = function () {
      deck.queue(shuffle);
    };

    function shuffle(cb) {
      if (shuffling === 0) {
        shuffling = -1;

        cb && cb();
        return;
      }

      if (shuffling === -1) {
        shuffling = 2;
      } else {
        shuffling--;
      }

      cards.sort(function () {
        return Math.random() * 100 - 50;
      });

      cards.forEach(function (card, i) {
        card.pos = i;

        card.shuffle(shuffling, function (i) {
          if (i === 51) {
            shuffle(cb);
          }
        });
      });
      return;
    }
  }

  function queue(target) {
    var queueing = [];

    target.queue = queue;

    return target;

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

  function deck() {
    var cards = new Array(52);
    var self = observable({ mount: mount, unmount: unmount, cards: cards });

    var $el = createElement('div');
    var $root;

    var card;

    queue(self);
    shuffleable(self, cards);

    self.sort = sort;
    self.bysuit = bysuit;
    self.poker = poker;
    self.fan = fan;

    $el.classList.add('deck');

    self.queue(function (next) {
      for (var i = 0, len = cards.length; i < len; i++) {
        card = cards[i] = Card(i);

        card.intro(i, function (i) {
          if (i === 51) {
            next();
          }
        });

        card.mount($el);
      }
    });

    self.sort();

    return self;

    function mount(root) {
      $root = root;
      $root.appendChild($el);
    }

    function unmount() {
      $root.removeChild($el);
    }

    function fan() {
      self.queue(function (next) {
        cards.forEach(function (card, i) {
          card.fan(i, function (i) {
            if (i === 51) {
              next();
            }
          });
        });
      });
    }

    function bysuit() {
      self.sort(true);
      self.queue(function (next) {
        cards.forEach(function (card) {
          card.bysuit(function (i) {
            if (i === 51) {
              next();
            }
          });
        });
      });
    }

    function poker() {
      self.shuffle();
      self.queue(function (next) {
        cards.slice(-5).forEach(function (card, i) {
          card.poker(i, function (i) {
            if (i === 4) {
              next();
            }
          });
        });
      });
    }

    function sort(reverse) {
      self.queue(function (cb) {
        cards.sort(function (a, b) {
          if (reverse) {
            return a.i - b.i;
          } else {
            return b.i - a.i;
          }
        });
        cards.forEach(function (card, i) {
          card.sort(i, function (i) {
            if (i === 51) {
              cb();
            }
          }, reverse);
        });
      });
    }
  }

  return deck;
})();
