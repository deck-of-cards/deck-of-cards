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

  var has3d;

  function translate(a, b, c) {
    typeof has3d !== 'undefined' || (has3d = check3d());

    c = c || 0;

    if (has3d) {
      return 'translate3d(' + a + ', ' + b + ', ' + c + ')';
    } else {
      return 'translate(' + a + ', ' + b + ')';
    }
  }

  function check3d() {
    var transform = prefix('transform');
    var $p = document.createElement('p');

    document.body.appendChild($p);
    $p.style[transform] = 'translate3d(1px,1px,1px)';

    has3d = $p.style[transform];
    has3d = has3d != null && has3d.length && has3d !== 'none';

    document.body.removeChild($p);

    return has3d;
  }

  var ease = {
    linear: function linear(t) {
      return t;
    },
    quadIn: function quadIn(t) {
      return t * t;
    },
    quadOut: function quadOut(t) {
      return t * (2 - t);
    },
    quadInOut: function quadInOut(t) {
      return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    cubicIn: function cubicIn(t) {
      return t * t * t;
    },
    cubicOut: function cubicOut(t) {
      return --t * t * t + 1;
    },
    cubicInOut: function cubicInOut(t) {
      return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    },
    quartIn: function quartIn(t) {
      return t * t * t * t;
    },
    quartOut: function quartOut(t) {
      return 1 - --t * t * t * t;
    },
    quartInOut: function quartInOut(t) {
      return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t;
    },
    quintIn: function quintIn(t) {
      return t * t * t * t * t;
    },
    quintOut: function quintOut(t) {
      return 1 + --t * t * t * t * t;
    },
    quintInOut: function quintInOut(t) {
      return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t;
    }
  };

  var ticking;
  var animations = [];

  function animationFrames(delay, duration) {
    var now = Date.now();
    var start = now + delay;
    var end = start + duration;

    var animation = {
      start: start,
      end: end
    };

    animations.push(animation);

    if (!ticking) {
      ticking = true;
      requestAnimationFrame(tick);
    }
    var self = {
      start: function start(cb) {
        animation.startcb = cb;
        return self;
      },
      progress: function progress(cb) {
        animation.progresscb = cb;
        return self;
      },
      end: function end(cb) {
        animation.endcb = cb;
        return self;
      }
    };
    return self;
  }

  var previousTick = 0;

  function tick() {
    var now = Date.now();

    if (now - previousTick < 1000 / 60) {
      // maintain 60 fps
      requestAnimationFrame(tick);
      return;
    }
    previousTick = now;

    if (!animations.length) {
      ticking = false;
      return;
    }

    for (var i = 0, animation; i < animations.length; i++) {
      animation = animations[i];
      if (now < animation.start) {
        continue;
      }
      if (!animation.started) {
        animation.started = true;
        animation.startcb && animation.startcb();
      }
      var t = (now - animation.start) / (animation.end - animation.start);
      animation.progresscb && animation.progresscb(t < 1 ? t : 1);
      if (now > animation.end) {
        // Animation ended
        animation.endcb && animation.endcb();
        animations.splice(i--, 1);
        continue;
      }
    }
    requestAnimationFrame(tick);
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
          card.sort(i, cards.length, function (i) {
            if (i === cards.length - 1) {
              next();
            }
          }, reverse);
        });
      }
    },
    card: function card(_card) {
      var transform = prefix('transform');

      var $el = _card.$el;

      _card.sort = function (i, len, cb, reverse) {
        var z = i / 4;
        var delay = i * 10;

        var xStart;
        var yStart;
        var rotStart;

        var xDiff;
        var yDiff;
        var rotDiff;

        animationFrames(delay, 400).start(function () {
          xStart = _card.x;
          yStart = _card.y;
          rotStart = _card.rot;
          xDiff = -z - xStart;
          yDiff = -150 - yStart;
          rotDiff = 0 - rotStart;
        }).progress(function (t) {
          t = ease.quadOut(t);
          _card.x = xStart + xDiff * t;
          _card.y = yStart + yDiff * t;
          _card.rot = rotStart + rotDiff * t;
          $el.style[transform] = translate(_card.x + 'px', _card.y + 'px') + (_card.rot ? ' rotate(' + _card.rot + 'deg)' : '');
        }).end(function () {
          $el.style.zIndex = i;
        });

        animationFrames(delay + 500, 400).start(function () {
          yStart = _card.y;
          yDiff = -z - yStart;
        }).progress(function (t) {
          t = ease.quadOut(t);
          _card.y = yStart + yDiff * t;
          $el.style[transform] = translate(-z + 'px', _card.y + 'px');
        }).end(function () {
          cb(i);
        });
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

  var ___fontSize;

  var shuffle = {
    deck: function deck(_deck3) {
      _deck3.shuffle = _deck3.queued(shuffle);

      function shuffle(next) {
        var cards = _deck3.cards;

        ___fontSize = getFontSize();

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

      var $el = _card2.$el;

      _card2.shuffle = function (cb) {
        var i = _card2.pos;
        var z = i / 4;
        var offsetX = plusMinus(Math.random() * 40 + 20) * ___fontSize / 16;
        var delay = i * 2;

        var xStart;
        var yStart;
        var rotStart;

        var xDiff;
        var yDiff;
        var rotDiff;

        animationFrames(delay, 200).start(function () {
          xStart = _card2.x;
          yStart = _card2.y;
          rotStart = _card2.rot || 0;

          xDiff = offsetX - xStart;
          yDiff = -z - yStart;
          rotDiff = 0 - rotStart;
        }).progress(function (t) {
          t = ease.quadOut(t);
          _card2.x = xStart + xDiff * t;
          _card2.y = yStart + yDiff * t;
          _card2.rot = rotStart + rotDiff * t;
          $el.style[transform] = translate(_card2.x + 'px', _card2.y + 'px') + (_card2.rot ? ' rotate(' + _card2.rot + 'deg)' : '');
        });
        animationFrames(200 + delay, 200).start(function () {
          xStart = _card2.x;
          yStart = _card2.y;
          rotStart = _card2.rot || 0;

          xDiff = -z - xStart;
          yDiff = -z - yStart;
          rotDiff = 0 - rotStart;

          $el.style.zIndex = i;
        }).progress(function (t) {
          t = ease.quadOut(t);
          _card2.x = xStart + xDiff * t;
          _card2.y = yStart + yDiff * t;
          _card2.rot = rotStart + rotDiff * t;
          $el.style[transform] = translate(_card2.x + 'px', _card2.y + 'px') + (_card2.rot ? ' rotate(' + _card2.rot + 'deg)' : '');
        }).end(function () {
          setTimeout(function () {
            cb(i);
          }, 0);
        });
      };
    }
  };

  var __fontSize;

  var poker = {
    deck: function deck(_deck4) {
      _deck4.poker = _deck4.queued(poker);

      function poker(next) {
        var cards = _deck4.cards;
        var len = cards.length;

        __fontSize = getFontSize();

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

      var $el = _card3.$el;

      _card3.poker = function (i, len, cb) {
        var delay = i * 250;
        var target = {
          x: Math.round((i - 2.05) * 70 * __fontSize / 16),
          y: Math.round(-110 * __fontSize / 16)
        };

        var xStart, yStart, rotStart;
        var xDiff, yDiff, rotDiff;

        animationFrames(delay, 250).start(function () {
          xStart = _card3.x;
          yStart = _card3.y;
          rotStart = _card3.rot || 0;

          xDiff = target.x - xStart;
          yDiff = target.y - yStart;
          rotDiff = 0 - rotStart;
          $el.style.zIndex = len - 1 + i;
        }).progress(function (t) {
          t = ease.quadOut(t);
          _card3.x = xStart + xDiff * t;
          _card3.y = yStart + yDiff * t;
          _card3.rot = rotStart + rotDiff * t;

          $el.style[transform] = translate(_card3.x + 'px', _card3.y + 'px') + (_card3.rot ? ' rotate(' + _card3.rot + 'deg)' : '');
        }).end(function () {
          cb(i);
        });
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
            animationFrames(250, 0).start(function () {
              card.setSide('back');
            });
            if (i === cards.length - 1) {
              next();
            }
          });
        });
      }
    },
    card: function card(_card4) {
      var transform = prefix('transform');

      var $el = _card4.$el;

      _card4.intro = function (i, cb) {
        var delay = 500 + i * 10;
        var z = i / 4;

        $el.style[transform] = translate(-z + 'px', '-250px');
        $el.style.opacity = 0;

        _card4.x = -z;

        var yDiff = -z - -250;

        animationFrames(delay, 1000).start(function () {
          $el.style.zIndex = i;
        }).progress(function (t) {
          $el.style.opacity = t;
          t = ease.quartOut(t);
          _card4.y = -250 + yDiff * t;
          $el.style[transform] = translate(-z + 'px', _card4.y + 'px');
        }).end(function () {
          $el.style.opacity = '';
          cb && cb(i);
        });
      };
    }
  };

  var _fontSize;

  var fan = {
    deck: function deck(_deck6) {
      _deck6.fan = _deck6.queued(fan);

      function fan(next) {
        var cards = _deck6.cards;
        var len = cards.length;

        _fontSize = getFontSize();

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

      var $el = _card5.$el;

      _card5.fan = function (i, len, cb) {
        var z = i / 4;
        var delay = i * 10;
        var rot = i / (len - 1) * 260 - 130;

        var xStart;
        var yStart;
        var rotStart;

        var xDiff;
        var yDiff;
        var rotDiff;

        animationFrames(delay, 300).start(function () {
          xStart = _card5.x;
          yStart = _card5.y;
          rotStart = _card5.rot || 0;

          xDiff = -z - xStart;
          yDiff = -z - yStart;

          rotDiff = 0 - rotStart;
        }).progress(function (t) {
          t = ease.quadOut(t);
          _card5.x = xStart + xDiff * t;
          _card5.y = yStart + yDiff * t;
          _card5.rot = rotStart + rotDiff * t;
          $el.style[transform] = translate(_card5.x + 'px', _card5.y + 'px') + (_card5.rot ? ' rotate(' + _card5.rot + 'deg)' : '');
        });
        animationFrames(300 + delay, 300).start(function () {
          xStart = _card5.x;
          yStart = _card5.y;
          rotStart = _card5.rot || 0;

          xDiff = Math.cos(deg2rad(rot - 90)) * 55 * _fontSize / 16 - xStart;
          yDiff = Math.sin(deg2rad(rot - 90)) * 55 * _fontSize / 16 - yStart;
          rotDiff = rot - rotStart;
        }).progress(function (t) {
          t = ease.quadOut(t);
          _card5.x = xStart + xDiff * t;
          _card5.y = yStart + yDiff * t;
          _card5.rot = rotStart + rotDiff * t;

          $el.style[transform] = translate(_card5.x + 'px', _card5.y + 'px') + (_card5.rot ? ' rotate(' + _card5.rot + 'deg)' : '');
        }).end(function () {
          cb(i);
        });
      };
    }
  };

  function deg2rad(degrees) {
    return degrees * Math.PI / 180;
  }

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

      var rank = _card6.rank;
      var suit = _card6.suit;

      var $el = _card6.$el;

      _card6.bysuit = function (cb) {
        var i = _card6.i;
        var delay = i * 10;
        var posX = -Math.round((6.75 - rank) * 8 * fontSize / 16);
        var posY = -Math.round((1.5 - suit) * 92 * fontSize / 16);

        var xStart;
        var yStart;
        var xDiff;
        var yDiff;
        var rotStart;
        var rotDiff;

        animationFrames(delay, 400).start(function () {
          xStart = _card6.x;
          yStart = _card6.y;
          rotStart = _card6.rot || 0;
          xDiff = posX - xStart;
          yDiff = posY - yStart;
          rotDiff = 0 - rotStart;
        }).progress(function (t) {
          t = ease.quadOut(t);
          _card6.x = xStart + xDiff * t;
          _card6.y = yStart + yDiff * t;
          _card6.rot = rotStart + rotDiff * t;
          $el.style[transform] = translate(_card6.x + 'px', _card6.y + 'px') + (_card6.rot ? ' rotate(' + _card6.rot + 'deg)' : '');
        }).end(function () {
          cb(i);
        });
      };
    }
  };

  function createElement(type) {
    return document.createElement(type);
  }

  var maxZ = 52;

  function Card(i) {
    var transform = prefix('transform');

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

      $el.style[transform] = translate(self.x + 'px', self.y + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
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

        $el.style[transform] = translate(Math.round(self.x + pos.x - startPos.x) + 'px', Math.round(self.y + pos.y - startPos.y) + 'px') + (self.rot ? ' rotate(' + self.rot + 'deg)' : '');
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

    for (var i = cards.length; i; i--) {
      card = cards[i - 1] = Card(i - 1);
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
