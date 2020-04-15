function findMiddleware (entity) {
  return entity.game.middleware.filter(function (middleware) {
    var type = middleware.type;
    var style = middleware.style;

    if (style) {
      if (style !== entity.style) {
        return false;
      } else if (type !== entity.type) {
        return false;
      }
    } else if (type) {
      if (type !== entity.type) {
        return false;
      }
    }
    return true;
  });
}

var Entity = function Entity (options) {
  if ( options === void 0 ) options = {};

  var parent = options.parent;
  var type = options.type;
  var style = options.style;
  var x = options.x; if ( x === void 0 ) x = 0;
  var y = options.y; if ( y === void 0 ) y = 0;
  var z = options.z; if ( z === void 0 ) z = 0;
  var i = options.i; if ( i === void 0 ) i = 0;

  this.parent = parent;
  this.type = type;
  this.style = style;
  this.x = x;
  this.y = y;
  this.z = z;
  this.i = i;
};

var prototypeAccessors = { middleware: { configurable: true },game: { configurable: true } };

prototypeAccessors.middleware.get = function () {
  return findMiddleware(this);
};

prototypeAccessors.game.get = function () {
  var game = this.parent;

  while (game.parent) {
    game = game.parent;
  }

  return game;
};

Entity.prototype.trigger = function trigger (event) {
    var data = [], len = arguments.length - 1;
    while ( len-- > 0 ) data[ len ] = arguments[ len + 1 ];

  for (var i = 0; i < this.middleware.length; i++) {
    var middleware = this.middleware[i];
    var handler = middleware[event];

    if (handler) {
      handler.apply(void 0, [ this ].concat( data ));
    }
  }
};

Object.defineProperties( Entity.prototype, prototypeAccessors );

var Card = /*@__PURE__*/(function (Entity) {
  function Card (options) {
    if ( options === void 0 ) options = {};

    var style = options.style; if ( style === void 0 ) style = 'standard';
    var x = options.x; if ( x === void 0 ) x = 0;
    var y = options.y; if ( y === void 0 ) y = 0;
    var z = options.z; if ( z === void 0 ) z = 0;
    var i = options.i;
    var side = options.side; if ( side === void 0 ) side = 'front';

    Entity.call(this, { type: 'Card', style: style, x: x, y: y, z: z, i: i });
    this.side = side;
  }

  if ( Entity ) Card.__proto__ = Entity;
  Card.prototype = Object.create( Entity && Entity.prototype );
  Card.prototype.constructor = Card;

  Card.prototype.update = function update (data) {
    var x = data.x;
    var y = data.y;
    var z = data.z;
    var i = data.i;
    var side = data.side;

    this.x = x;
    this.y = y;
    this.z = z;
    this.i = i;
    this.side = side;
  };

  return Card;
}(Entity));

var Deck = /*@__PURE__*/(function (Entity) {
  function Deck (options) {
    if ( options === void 0 ) options = {};

    var x = options.x; if ( x === void 0 ) x = 0;
    var y = options.y; if ( y === void 0 ) y = 0;
    var style = options.style; if ( style === void 0 ) style = 'standard';
    var parent = options.parent;

    Entity.call(this, {
      type: 'Deck',
      parent: parent,
      style: style,
      x: x,
      y: y
    });

    this.children = [];

    if (parent) {
      parent.add(this);
    }
  }

  if ( Entity ) Deck.__proto__ = Entity;
  Deck.prototype = Object.create( Entity && Entity.prototype );
  Deck.prototype.constructor = Deck;

  Deck.prototype.createCards = function createCards () {
    this.trigger('createCards', { Card: Card });
  };

  Deck.prototype.add = function add (card) {
    if (card.parent) {
      card.parent.remove(card);
    }

    card.parent = this;

    this.children.push(card);
    card.trigger('add');
    return this;
  };

  Deck.prototype.remove = function remove (card) {
    var index = this.children.indexOf(card);

    if (~index) {
      this.children.splice(index, 1);
      card.parent = null;
      card.trigger('remove');
    }
  };

  return Deck;
}(Entity));

/* global requestAnimationFrame, cancelAnimationFrame */

var Game = function Game (options) {
  if ( options === void 0 ) options = {};

  var width = options.width; if ( width === void 0 ) width = 1920;
  var height = options.height; if ( height === void 0 ) height = 1080;
  var DEBUG = options.DEBUG;
  this.type = 'Game';
  this.width = width;
  this.height = height;
  this.children = [];
  this.middleware = [];

  if (DEBUG) {
    this.DEBUG = DEBUG;
  }
};

Game.prototype.trigger = function trigger (event, data) {
    var this$1 = this;

  findMiddleware(Object.assign({}, this, {game: this}))
    .forEach(function (middleware) {
      var handler = middleware[event];

      if (handler) {
        handler(this$1, data);
      }
    });
};

Game.prototype.startRender = function startRender (container) {
    var this$1 = this;

  this._rendering = requestAnimationFrame(function () {
    this$1.startRender(container);
    this$1.render(container);
  });
};

Game.prototype.stopRender = function stopRender () {
  cancelAnimationFrame(this._rendering);
};

Game.prototype.render = function render (container) {
  this.trigger('renderGame', container);
};

Game.prototype.add = function add (entity) {
  if (entity.parent) {
    entity.parent.remove(entity);
  }
  entity.parent = this;

  this.children.push(entity);

  entity.trigger('add');

  return this;
};

Game.prototype.remove = function remove (entity) {
  var index = this.children.indexOf(entity);

  if (~index) {
    this.children.splice(index, 1);
    entity.parent = null;

    entity.trigger('remove');
  }

  return this;
};

Game.prototype.use = function use (middleware) {
    var this$1 = this;

  if (middleware.length) {
    middleware.forEach(function (middleware) {
      this$1.middleware.push(middleware);
    });
  } else {
    this.middleware.push(middleware);
  }
};

var card = {
  type: 'Card',
  style: 'standard',
  add: function add (card) {
    card.width = 100;
    card.height = 140;
  },
  render: function render (card) {
    var i = card.i;
    var side = card.side;
    var el = card.el;

    if (side === 'front') {
      el.style.backgroundImage = "url(standard-deck/front-" + i + ".png)";
    } else {
      el.style.backgroundImage = 'url(standard-deck/back.png)';
    }

    return card;
  }
}
;

var deck = {
  type: 'Deck',
  style: 'standard',
  createCards: function createCards (deck, ref) {
    var Card = ref.Card;

    var count = 54;

    for (var i = 0; i < count; i++) {
      var card = new Card({
        x: -i / 4,
        y: -i / 4,
        i: count - i - 1
      });

      deck.add(card);
    }
  }
};

var standardDeck = [
  card,
  deck
];

var gameRenderer = {
  type: 'Game',
  renderGame: function renderGame (game, container) {
    var width = game.width;
    var height = game.height;
    var children = game.children;

    container.style.position = 'absolute';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = "translate(" + (-width / 2) + "px, " + (-height / 2) + "px)";
    container.style.width = width + 'px';
    container.style.height = height + 'px';
    container.style.overflow = 'hidden';

    renderChildren(container, children);
  }
};

function renderChildren (container, children) {
  var traverse = container.firstChild;

  for (var i = 0; i < children.length; i++) {
    var entity = children[i];

    if (!entity.el) {
      entity.trigger('createEl');
    }

    entity.trigger('render');

    if (entity.el) {
      if (traverse === entity.el) {
        traverse = traverse.nextSibling;
      } else if (traverse) {
        container.insertBefore(entity.el, traverse);
      } else {
        container.appendChild(entity.el);
      }
    }
  }
  while (traverse) {
    var next = traverse.nextSibling;

    container.removeChild(traverse);

    traverse = next;
  }
}

var deckRenderer = {
  type: 'Deck',
  createEl: function createEl (deck) {
    var el = document.createElement('div');

    el.style.position = 'absolute';

    deck.el = el;
  },
  render: function render (deck) {
    var x = deck.x;
    var y = deck.y;
    var el = deck.el;

    el.style.transform = "translate(" + (Math.round(x)) + "px, " + (Math.round(y)) + "px)";

    renderChildren(el, deck.children);
  }
};

var cardRenderer = {
  type: 'Card',
  createEl: function createEl (card) {
    card.el = document.createElement('div');
    card.el.style.position = 'absolute';
    card.el.style.backgroundPosition = '50% 50%';
    card.el.style.backgroundRepeat = 'no-repeat';
    card.el.style.backgroundSize = 'contain';
    card.el.style.backgroundColor = '#fff';
    card.el.style.borderRadius = (6 / 1) + "% " + (6 / 1.4) + "%";
    card.el.style.boxShadow = '0 1px 1px rgba(0, 0, 0, .05)';
    card.el.style.overflow = 'hidden';
    card.el.style.willChange = 'transform';
  },
  render: function render (card) {
    var x = card.x;
    var y = card.y;
    var i = card.i;
    var side = card.side;
    var el = card.el;
    var width = card.width;
    var height = card.height;

    el.style.transform = "translate(" + (Math.round(x)) + "px, " + (Math.round(y)) + "px)";
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.marginLeft = -width / 2 + 'px';
    el.style.marginTop = -height / 2 + 'px';

    if (side === 'front') {
      el.style.backgroundImage = "url(standard-deck/front-" + i + ".png)";
    } else {
      el.style.backgroundImage = 'url(standard-deck/back.png)';
    }
  }
};

var domRenderer = [
  gameRenderer,
  deckRenderer,
  cardRenderer
];

var entityInteraction = {
  createEl: function createEl (entity) {
    entity.el.addEventListener('mousedown', startmove);

    function startmove (e) {
      var startPos = {
        x: e.touches ? e.touches[0].pageX : e.pageX,
        y: e.touches ? e.touches[0].pageY : e.pageY
      };
      var longpressDelay = setTimeout(function () {
        entity.trigger('holdmove');
      }, 2000);
      entity.trigger('startmove', startPos);

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', endmove);

      window.addEventListener('touchmove', move);
      window.addEventListener('touchend', endmove);

      var prevPos = startPos;

      function move (e) {
        var pos = {
          x: e.touches ? e.touches[0].pageX : e.pageX,
          y: e.touches ? e.touches[0].pageY : e.pageY
        };

        var diff = {
          x: pos.x - startPos.x,
          y: pos.y - startPos.y
        };

        if (Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))) {
          clearTimeout(longpressDelay);
        }

        var delta = {
          x: pos.x - prevPos.x,
          y: pos.y - prevPos.y
        };

        prevPos = pos;

        entity.trigger('move', pos, delta, diff, startPos);
      }

      function endmove (e) {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', endmove);

        window.removeEventListener('touchmove', move);
        window.removeEventListener('touchend', endmove);

        entity.trigger('endmove', prevPos, startPos);
      }
    }
  }
};

var cardInteraction = {
  type: 'Card',
  startmove: function startmove (card, pos) {
  },
  holdmove: function holdmove (card) {
    if (card.parent) {
      card.parent._moving = true;
    }
  },
  move: function move (card, pos, delta, diff, startPos) {
    if (card.parent) {
      if (card.parent._moving) {
        return;
      }
    }
    card.x += delta.x;
    card.y += delta.y;
  },
  endmove: function endmove (card, pos, startPos) {
  }
};

var deckInteraction = {
  type: 'Deck',
  startmove: function startmove (deck, pos) {
  },
  move: function move (deck, pos, diff, startPos) {
  },
  endmove: function endmove (deck) {
    deck._moving = false;
  }
};

var interaction = [
  entityInteraction,
  cardInteraction,
  deckInteraction
];

var game = new Game({
  width: 1920,
  height: 1080
});

game.use(domRenderer);
game.use(standardDeck);
game.use(interaction);

var deck$1 = new Deck({
  x: 1920 / 2,
  y: 1080 / 2
});

game.add(deck$1);

deck$1.createCards();

var container = document.getElementById('cards');

game.startRender(container);
