var chars = '0123456789abcdefghjkmnpqrstvwxyz';

function generateUID (lookup) {
  var str = '';

  for (var i = 0; i < 10; i++) {
    str += chars[(Math.random() * 32) | 0];
  }
  var uid = str;

  while (lookup[uid]) {
    return generateUID(lookup);
  }

  return str;
}

function pile (game) {
  var cards = game.cards;

  cards.sort(function (c1, c2) {
    var ref = game.getPos(c1);
    var z1 = ref.z;
    var ref$1 = game.getPos(c2);
    var z2 = ref$1.z;

    if (z1 > z2) {
      return 1;
    } else if (z2 > z1) {
      return -1;
    } else {
      return 0;
    }
  });
}

function animate (target, duration, properties) {
  target.animate || (target.animate = {});

  for (var prop in properties) {
    target.animate[prop] = {
      duration: duration,
      from: target[prop],
      to: properties[prop]
    };

    target[prop] = properties[prop];
  }
}

function animations (card, animate) {
  var now = Date.now();

  var diff = {};

  for (var key in animate) {
    var ref = animate[key];
    var duration = ref.duration;
    var to = ref.to;
    var ref$1 = animate[key];
    var start = ref$1.start;
    var end = ref$1.end;
    var from = ref$1.from;

    if (!start) {
      start = animate[key].start = Date.now();
      end = animate[key].end = start + duration;
    }

    if (now < end) {
      diff[key] = (end - Date.now()) / duration * (from - to);
    }
  }

  return diff;
}

function on (target, eventName, handler) {
  target._events || (target._events = []);

  target._events.push({
    eventName: eventName,
    handler: handler
  });
}

function trigger (target, eventName, value) {
  target._events || (target._events = []);

  target._events
    .filter(function (event) { return event.eventName === eventName; })
    .forEach(function (event) { return event.handler(value); });
}

var Game = function Game (options) {
  if ( options === void 0 ) options = {};

  var width = options.width; if ( width === void 0 ) width = 1920;
  var height = options.height; if ( height === void 0 ) height = 1080;

  this.width = width;
  this.height = height;
  this.cards = [];
  this.piles = [];
  this._uids = {};
  this._cards = {};
  this._moving = [];
};

Game.prototype.trigger = function trigger$1 (eventName, value) {
  trigger(this, eventName, value);
};

Game.prototype.addDeck = function addDeck (deck) {
  this.addPile(deck);
};

Game.prototype.addPile = function addPile (pile) {
  pile.game = this;
  this.piles.push(pile);
  for (var i = 0; i < pile.cards.length; i++) {
    var card = pile.cards[i];
    if (card.game === this) {
      continue;
    }
    card.game = this;
    card.id = generateUID(this._uids);
    this.cards.push(card);
    this._cards[card.id] = card;
  }
};

Game.prototype.pile = function pile$1 () {
  pile(this);
};

Game.prototype.getCard = function getCard (id) {
  return this._cards[id];
};

Game.prototype.getPos = function getPos (card, doAnimations) {
  var x = card.x;
    var y = card.y;
    var z = card.z;
    var pile = card.pile;
    var animate = card.animate; if ( animate === void 0 ) animate = {};

  var diff = doAnimations ? animations(card, animate) : {};

  if (pile) {
    return {
      x: x + (diff.x || 0) + pile.x,
      y: y + (diff.y || 0) + pile.y,
      z: z + (diff.z || 0) + pile.z
    };
  } else {
    return {
      x: x + (diff.x || 0),
      y: y + (diff.y || 0),
      z: z + (diff.z || 0)
    };
  }
};

function intersecting (r1, r2) {
  var x1 = r1.x;
  var y1 = r1.y;
  var w1 = r1.width;
  var h1 = r1.height;

  var x2 = r2.x;
  var y2 = r2.y;
  var w2 = r2.width;
  var h2 = r2.height;

  return (
    (x1 + w1 >= x2) &&
    (x1 <= x2 + w2) &&
    (y1 + h1 >= y2) &&
    (y1 <= y2 + h2)
  );
}

var Pile = function Pile (options) {
  if ( options === void 0 ) options = {};

  var x = options.x; if ( x === void 0 ) x = 0;
  var y = options.y; if ( y === void 0 ) y = 0;
  var z = options.z; if ( z === void 0 ) z = 0;

  this.x = x;
  this.y = y;
  this.z = z;

  this.cards = [];
};

Pile.prototype.intersecting = function intersecting$1 (card, card2) {
  return intersecting(card, card2);
};

Pile.prototype.moveBack = function moveBack (card) {
  var cardIndex = this.cards.indexOf(card);
  if (this.cards.length === 2) {
    var anotherCard = this.cards.find(function (card2) { return card2 !== card; });
    var diffX = Math.abs(card.x - anotherCard.x);
    var diffY = Math.abs(card.y - anotherCard.y);

    this.vertical = diffY > diffX;
  }
  if (this.vertical) {
    animate(card, 200, { x: 0, y: cardIndex * 30 });
  } else {
    animate(card, 200, { x: cardIndex * 15, y: 0 });
  }
};

Pile.prototype.push = function push (card) {
  card.pile = this;
  card.x = card.x - this.x;
  card.y = card.y - this.y;

  this.cards.push(card);
  this.moveBack(card);
  card.z = this.cards.length;
};

Pile.prototype.move = function move (card) {
    var this$1 = this;

  var intersectingCards = this.cards
    .filter(function (card2) { return card2 !== card; })
    .filter(function (card2) { return this$1.intersecting(card, card2); });

  if (!intersectingCards.length) {
    this.remove(card);
  }
};

Pile.prototype.remove = function remove (card) {
  var removed = false;
  for (var i = 0; i < this.cards.length; i++) {
    var card2 = this.cards[i];

    if (card === card2) {
      card.pile = null;
      card.x += this.x;
      card.y += this.y;
      animate(card, 150, { z: 0 });
      this.cards.splice(i--, 1);
      removed = true;
    } else if (removed) {
      this.moveBack(card2);
      card2.z--;
    }
  }
  if (this.cards.length === 1) {
    this.remove(this.cards[0]);
  }
};

var StandardCard = function StandardCard (ref) {
  var game = ref.game;

  this.game = game;
  this.el = document.createElement('img');
  this.el.draggable = false;
  this.el.style.touchAction = 'none';
  this.el.style.position = 'absolute';
};

StandardCard.prototype.update = function update (card) {
  var ref = this;
    var game = ref.game;
  var i = card.i;
    var side = card.side;
    var graphics = card.graphics;
    var width = card.width;
    var height = card.height;
  var front = graphics.front;
    var back = graphics.back;
  var ref$1 = game.getPos(card, true);
    var x = ref$1.x;
    var y = ref$1.y;

  this.card = card;

  var src = side === 'back' ? back : front[i];
  var transform = "translate(" + (Math.round(x)) + "px, " + (Math.round(y)) + "px)";

  if (src !== this.src) {
    this.el.src = src;
    this.src = src;
  }

  if (width !== this.width || height !== this.height) {
    this.el.width = width;
    this.el.height = height;
    this.el.style.marginLeft = -width / 2 + 'px';
    this.el.style.marginTop = -height / 2 + 'px';
    this.width = this.width;
    this.height = this.height;
  }

  if (transform !== this.transform) {
    this.el.style.transform = transform;
    this.transform = transform;
  }
};

var front = new Array(54);

for (var i = 0; i < front.length; i++) {
  front[i] = "img/front-" + i + ".png";
}

var standardDeck = {
  width: 102,
  height: 144,
  back: 'img/back.png',
  front: front,
  View: StandardCard
};

function cardIntersecting (card, anotherCard) {
  var ref = card.game.getPos(card);
  var x1 = ref.x;
  var y1 = ref.y;
  var ref$1 = card.game.getPos(anotherCard);
  var x2 = ref$1.x;
  var y2 = ref$1.y;
  var w1 = anotherCard.width;
  var h1 = anotherCard.height;
  var w2 = anotherCard.width;
  var h2 = anotherCard.height;

  return intersecting({
    x: x1,
    y: y1,
    width: w1,
    height: h1
  }, {
    x: x2,
    y: y2,
    width: w2,
    height: h2
  });
}

var Card = function Card (options) {
  var this$1 = this;
  if ( options === void 0 ) options = {};

  var i = options.i; if ( i === void 0 ) i = 0;
  var x = options.x; if ( x === void 0 ) x = 0;
  var y = options.y; if ( y === void 0 ) y = 0;
  var z = options.z; if ( z === void 0 ) z = 0;
  var graphics = options.graphics; if ( graphics === void 0 ) graphics = standardDeck;
  var pile = options.pile;

  this.i = i;
  this.x = x;
  this.y = y;
  this.z = z;
  this.graphics = graphics;
  this.pile = pile;

  on(this, 'move', function (diff) {
    var card = this$1;
    var game = card.game;

    card.x += diff.x;
    card.y += diff.y;

    if (card.pile) {
      card.pile.move(card);
    } else {
      var intersectingCards = game.cards
        .filter(function (card2) { return !card2.pile; })
        .filter(function (card2) { return card !== card2; })
        .filter(function (card2) { return card.intersecting(card2); });

      var intersectingPiles = game.piles
        .filter(function (pile) { return pile.cards.find(function (card2) { return card.intersecting(card2); }); })
        .map(function (pile) {
          return Object.assign({}, pile,
            {z: Math.max.apply(Math, pile.cards.map(function (card) { return card.z; }))});
        });

      var z = Math.max.apply(Math, [ -1 ].concat( intersectingCards.concat(intersectingPiles).map(function (card) { return card.z; }) )) + 1;

      if (card.z !== z) {
        animate(card, 150, { z: z });
      }
      game.pile();
    }
  });

  on(this, 'moveend', function () {
    var card = this$1;
    var game = card.game;

    if (card.pile) {
      card.pile.moveBack(card);
    } else {
      var intersectingPile = game.piles
        .find(function (pile) { return pile.cards.find(function (card2) { return card.intersecting(card2); }); });

      if (intersectingPile) {
        intersectingPile.push(card);
        game.pile();
        return;
      }
      var intersectingCard = game.cards
        .filter(function (card2) { return card !== card2; })
        .filter(function (card2) { return !card2.pile; })
        .find(function (card2) { return card.intersecting(card2); });

      if (intersectingCard) {
        var pile = new Pile();
        pile.x = intersectingCard.x;
        pile.y = intersectingCard.y;

        var diffX = card.x - intersectingCard.x;
        var diffY = card.y - intersectingCard.y;

        if (Math.abs(diffY) > Math.abs(diffX)) {
          pile.vertical = true;
        }

        pile.push(intersectingCard);
        pile.push(card);

        game.addPile(pile);
        game.pile();
      }
    }
  });
};

var prototypeAccessors = { width: { configurable: true },height: { configurable: true } };

Card.prototype.intersecting = function intersecting (anotherCard) {
  return cardIntersecting(this, anotherCard);
};

prototypeAccessors.width.get = function () {
  return this.graphics.width;
};

prototypeAccessors.height.get = function () {
  return this.graphics.height;
};

Object.defineProperties( Card.prototype, prototypeAccessors );

function shuffle (array) {
  if (!array.length) {
    return array;
  }
  for (var i = array.length - 1; i; i--) {
    var rnd = Math.floor(Math.random() * (i + 1));
    var temp = array[i];

    array[i] = array[rnd];
    array[rnd] = temp;
  }

  return array;
}

var Deck = /*@__PURE__*/(function (Pile) {
  function Deck (options) {
    var this$1 = this;
    if ( options === void 0 ) options = {};

    var graphics = options.graphics; if ( graphics === void 0 ) graphics = standardDeck;

    Pile.call(this, Object.assign({}, options,
      {graphics: graphics}));

    this.cards = graphics.front.map(function (card, i) { return new Card({
      graphics: graphics,
      pile: this$1,
      i: 53 - i,
      x: -i / 4,
      y: -i / 4,
      z: i
    }); });
  }

  if ( Pile ) Deck.__proto__ = Pile;
  Deck.prototype = Object.create( Pile && Pile.prototype );
  Deck.prototype.constructor = Deck;

  Deck.prototype.shuffle = function shuffle$1 () {
    shuffle(this.cards);
    this.cards.forEach(function (card, i) {
      card.x = -i / 4;
      card.y = -i / 4;
      card.z = i;
    });
    this.game.pile();
  };

  Deck.prototype.moveBack = function moveBack (card) {
    var cardIndex = this.cards.indexOf(card);
    animate(card, 200, { x: -cardIndex / 4, y: -cardIndex / 4 });
  };

  Deck.prototype.push = function push (card) {
    card.pile = this;
    card.x = card.x - this.x;
    card.y = card.y - this.y;

    animate(card, 200, {
      x: -this.cards.length / 4,
      y: -this.cards.length / 4
    });

    this.cards.push(card);
    card.z = this.cards.length - 1;
  };

  return Deck;
}(Pile));

var Renderer = function Renderer (ref) {
  var game = ref.game;

  this.game = game;
  this.container = document.createElement('div');
  this.container.style.width = game.width + 'px';
  this.container.style.height = game.height + 'px';
  this.container.style.top = '50%';
  this.container.style.left = '50%';
  this.container.style.position = 'absolute';
  this.container.style.transform = 'translate(-50%, -50%)';
  this.views = [];
  this.viewsLookup = {};
};

Renderer.prototype.mountTo = function mountTo (parent) {
  parent.appendChild(this.container);
};

Renderer.prototype.render = function render () {
  var ref = this;
    var game = ref.game;
    var container = ref.container;
  var cards = game.cards;

  var views = new Array(cards.length);
  var viewsLookup = {};

  for (var i = 0; i < cards.length; i++) {
    var card = cards[i];
    var id = card.id;
      var graphics = card.graphics;
    var View = graphics.View;

    var view = this.viewsLookup[id] || createView(View, game);
    view.id = id;
    views[i] = view;
    viewsLookup[id] = view;

    view.update(card);
  }

  var traverse = container.firstChild;

  for (var i$1 = 0; i$1 < views.length; i$1++) {
    var view$1 = views[i$1];

    if (traverse === view$1.el) {
      traverse = traverse.nextSibling;
    } else if (traverse) {
      container.insertBefore(view$1.el, traverse);
    } else {
      container.appendChild(view$1.el);
    }
  }

  this.views = views;
  this.viewsLookup = viewsLookup;
};

function createView (View, game) {
  var view = new View({ game: game });

  view.el.addEventListener('mousedown', ondown);
  view.el.addEventListener('touchstart', ondown);

  return view;

  function ondown (e) {
    game.trigger('cardmousedown', { view: view, e: e });
  }
}

function interaction (game, renderer) {
  on(game, 'cardmousedown', onmousedown);

  function onmousedown (ref) {
    var view = ref.view;
    var e = ref.e;

    var id = view.id;

    if (!id) {
      return;
    }

    var prev = {
      x: (e.touches ? e.touches[0] : e).pageX,
      y: (e.touches ? e.touches[0] : e).pageY
    };

    var card = game.getCard(id);

    if (card) {
      trigger(card, 'movestart');

      var onmousemove = function (e) {
        var x = (e.touches ? e.touches[0] : e).pageX;
        var y = (e.touches ? e.touches[0] : e).pageY;

        trigger(card, 'move', {
          x: x - prev.x,
          y: y - prev.y
        }
        );

        prev.x = x;
        prev.y = y;
      };

      var onmouseup = function (e) {
        window.removeEventListener('mousemove', onmousemove);
        window.removeEventListener('touchmove', onmousemove);

        window.removeEventListener('mouseup', onmouseup);
        window.removeEventListener('touchend', onmouseup);

        trigger(card, 'moveend');
      };

      window.addEventListener('mousemove', onmousemove);
      window.addEventListener('touchmove', onmousemove);

      window.addEventListener('mouseup', onmouseup);
      window.addEventListener('touchend', onmouseup);
    }
  }
}

/* global requestAnimationFrame */

var game = new Game({
  container: document.querySelector('#cards'),
  width: 1920,
  height: 1080
});

var renderer = new Renderer({
  game: game
});

var deck = new Deck({
  x: 960,
  y: 540
});

game.addDeck(deck);

interaction(game);

deck.shuffle();

renderer.mountTo(document.body);

render();

function render () {
  requestAnimationFrame(render);

  renderer.render();
}
