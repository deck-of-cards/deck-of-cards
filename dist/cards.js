function render (game, container) {
  container.style.width = game.width + 'px';
  container.style.height = game.height + 'px';

  var entities = game.entities;

  for (var i = 0; i < entities.length; i++) {
    var entity = entities[i];

    if (!entity.el) {
      Object.defineProperties(entity, {
        el: {
          writable: true,
          value: entity.createEl()
        }
      });
    }

    entity.render(entity.el, entity);
  }

  var traverse = container.firstChild;

  for (var i$1 = 0; i$1 < entities.length; i$1++) {
    var entity$1 = entities[i$1];

    if (traverse) {
      if (traverse === entity$1.el) {
        traverse = traverse.nextSibling;
        continue;
      } else {
        container.insertBefore(entity$1.el, traverse);
      }
    } else {
      container.appendChild(entity$1.el);
    }
  }

  while (traverse) {
    var next = traverse.nextSibling;

    container.removeChild(traverse);

    traverse = next;
  }
}

/* global requestAnimationFrame, cancelAnimationFrame */

var Game = function Game (options) {
  if ( options === void 0 ) options = {};

  var width = options.width; if ( width === void 0 ) width = 1920;
  var height = options.height; if ( height === void 0 ) height = 1080;

  this.width = width;
  this.height = height;

  Object.defineProperties(this, {
    children: {
      writable: true,
      value: []
    },
    rendering: {
      writable: true,
      value: null
    }
  });
};

var prototypeAccessors = { entities: { configurable: true },groups: { configurable: true } };

prototypeAccessors.entities.get = function () {
  return this.children
    .reduce(function (entities, child) {
      if (child.children) {
        return entities.concat(child.children);
      } else {
        return entities.concat(child);
      }
    }, []);
};

prototypeAccessors.groups.get = function () {
  return this.children
    .filter(function (child) { return child.children != null; });
};

Game.prototype.add = function add (item) {
  if (item.game) {
    item.game.remove(item);
  }
  if (item.group) {
    item.group.remove(item);
  }
  this.children.push(item);
  item.game = this;
  return this;
};

Game.prototype.remove = function remove (item) {
  var index = this.children.indexOf(item);

  if (~index) {
    this.children.splice(index, 1);
    item.game = null;
  }
  return this;
};

Game.prototype.render = function render$1 (container) {
  render(this, container);
};

Game.prototype.startRender = function startRender (container) {
    var this$1 = this;

  if (this.rendering) {
    return;
  }
  this.rendering = requestAnimationFrame(function () {
    this$1.rendering = null;
    this$1.startRender(container);
    this$1.render(container);
  });
};

Game.prototype.stopRender = function stopRender () {
  cancelAnimationFrame(this.rendering);
};

Object.defineProperties( Game.prototype, prototypeAccessors );

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

var Group = function Group (options) {
  var game = options.game;
  var type = options.type;
  var x = options.x;
  var y = options.y;
  this.type = type;
  this.x = x;
  this.y = y;

  Object.defineProperties(this, {
    children: {
      writable: true,
      value: []
    },
    game: {
      writable: true,
      value: game
    }
  });
};

Group.prototype.add = function add (entity) {
  if (entity.group) {
    entity.group.remove(entity);
    entity.x -= this.x;
    entity.y -= this.y;
  } else if (entity.game) {
    entity.x -= this.x;
    entity.y -= this.y;
  }
  entity.group = this;
  this.children.push(entity);
};

Group.prototype.remove = function remove (entity) {
  var index = this.children.indexOf(entity);
  if (~index) {
    entity.x += this.x;
    entity.y += this.y;
    entity.group = null;
    this.children.splice(index, 1);
  }
};

Group.prototype.intersecting = function intersecting$1 (card) {
  for (var i = 0; i < this.children.length; i++) {
    var child = this.children[i];

    if (child === card) {
      continue;
    }

    if (intersecting(child, card)) {
      return true;
    }
  }

  return false;
};

function animate (target, duration, properties) {
  Object.defineProperty(target, '_animate', {
    writable: true,
    value: {}
  });

  for (var prop in properties) {
    target._animate[prop] = {
      duration: duration,
      from: target[prop],
      to: properties[prop]
    };

    target[prop] = properties[prop];
  }
}

function getAnimatedProps (card) {
  var animate = card._animate || {};
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

var Entity = function Entity (options) {
  if ( options === void 0 ) options = {};

  var game = options.game;
  var group = options.group;
  var type = options.type;
  var style = options.style;
  var x = options.x;
  var y = options.y;
  var width = options.width;
  var height = options.height;

  this.type = type;
  this.style = style;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  Object.defineProperties(this, {
    _game: {
      writable: true,
      value: game
    },
    group: {
      writable: true,
      value: group
    }
  });
};

var prototypeAccessors$1 = { absolutePosition: { configurable: true },game: { configurable: true } };

prototypeAccessors$1.absolutePosition.get = function () {
  var pos = {
    x: this.x,
    y: this.y
  };

  var animatedProps = getAnimatedProps(this);

  pos.x += animatedProps.x || 0;
  pos.y += animatedProps.y || 0;

  if (this.group) {
    pos.x += this.group.x;
    pos.y += this.group.y;
  }

  return pos;
};

prototypeAccessors$1.game.set = function (game) {
  this._game = game;
};

prototypeAccessors$1.game.get = function () {
  return this.group ? this.group.game : this._game;
};

Object.defineProperties( Entity.prototype, prototypeAccessors$1 );

var Card = /*@__PURE__*/(function (Entity) {
  function Card (options) {
    if ( options === void 0 ) options = {};

    Entity.call(this, Object.assign({}, options,
      {type: 'Card'}));
    var i = options.i;

    this.i = i;

    Object.defineProperties(this, {
      _movingGroup: {
        writable: true,
        value: false
      }
    });
  }

  if ( Entity ) Card.__proto__ = Entity;
  Card.prototype = Object.create( Entity && Entity.prototype );
  Card.prototype.constructor = Card;

  Card.prototype.preMove = function preMove () {
    this._moving = true;
  };

  Card.prototype.hold = function hold () {
    if (this.group) {
      this._movingGroup = true;
      this._moving = false;
      this.group.children[0]._moving = true;
    }
  };

  Card.prototype.startMove = function startMove () {
    if (this._movingGroup) {
      this.group.game.add(this.group);
    } else {
      if (this.group) {
        this.group.game.add(this.group);
        this.group.add(this);
      } else {
        this.game.add(this);
      }
    }
  };

  Card.prototype.move = function move (delta) {
    if (this._movingGroup) {
      this.group.x += delta.x;
      this.group.y += delta.y;
    } else {
      this.x += delta.x;
      this.y += delta.y;

      if (this.group) {
        if (!this.group.intersecting(this)) {
          this.group.game.add(this);
        }
      }
    }
  };

  Card.prototype.endMove = function endMove () {
    if (this._movingGroup) {
      this._movingGroup = false;
      this.group.children.forEach(function (item) {
        item._moving = false;
      });
    } else {
      this._moving = false;
      if (this.group) {
        this.group.moveBack();
      }
    }
  };

  Card.prototype.handleEvent = function handleEvent (e) {
    var this$1 = this;

    if (e.type === 'mousedown' || e.type === 'touchstart') {
      var startPos = {
        x: (e.touches ? e.touches[0] : e).pageX,
        y: (e.touches ? e.touches[0] : e).pageY
      };

      this.preMove();

      var prevPos = startPos;
      var moved = false;
      var holdTimeout = setTimeout(function () {
        this$1.hold();
      }, 500);

      var move = function (e) {
        if (!moved) {
          clearTimeout(holdTimeout);
          this$1.startMove();
          moved = true;
        }

        var pos = {
          x: (e.touches ? e.touches[0] : e).pageX,
          y: (e.touches ? e.touches[0] : e).pageY
        };

        var delta = {
          x: pos.x - prevPos.x,
          y: pos.y - prevPos.y
        };

        this$1.move(delta);

        prevPos = pos;
      };

      var endmove = function (e) {
        if (moved) {
          this$1.endMove();
        }

        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', endmove);

        window.removeEventListener('touchmove', move);
        window.removeEventListener('touchend', endmove);
      };

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', endmove);

      window.addEventListener('touchmove', move);
      window.addEventListener('touchend', endmove);
    }
  };

  Card.prototype.createEl = function createEl () {
    var el = document.createElement('div');

    el.style.position = 'absolute';
    el.style.backgroundColor = '#fff';
    el.style.backgroundPosition = '50% 50%';
    el.style.backgroundSize = 'contain';
    el.style.backgroundRepeat = 'no-repeat';
    el.style.borderRadius = (6 / 1) + "% " + (6 / 1.4) + "%";
    el.style.overflow = 'hidden';
    el.style.willChange = 'transform';

    el.addEventListener('mousedown', this);
    el.addEventListener('touchstart', this);

    return el;
  };

  Card.prototype.render = function render (el, data) {
    var i = data.i;
    var width = data.width;
    var height = data.height;
    var absolutePosition = data.absolutePosition;
    var _moving = data._moving;
    var x = absolutePosition.x;
    var y = absolutePosition.y;

    el.style.transform = "translate(" + x + "px, " + y + "px)";
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.marginLeft = -width / 2 + 'px';
    el.style.marginTop = -height / 2 + 'px';
    el.style.backgroundImage = "url(standard-deck/front-" + i + ".png)";
    if (_moving) {
      el.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.25)';
    } else {
      el.style.boxShadow = '0px 1px 1px rgba(0, 0, 0, 0.05)';
    }
  };

  return Card;
}(Entity));

var Deck = /*@__PURE__*/(function (Group) {
  function Deck (options) {
    if ( options === void 0 ) options = {};

    Group.call(this, Object.assign({}, options,
      {type: 'Deck'}));
  }

  if ( Group ) Deck.__proto__ = Group;
  Deck.prototype = Object.create( Group && Group.prototype );
  Deck.prototype.constructor = Deck;

  Deck.prototype.createCards = function createCards (count, options) {
    for (var i = 0; i < count; i++) {
      var card = new Card(Object.assign({}, options,
        {i: count - i - 1,
        x: -i / 4,
        y: -i / 4}));
      this.add(card);
    }

    return this;
  };

  Deck.prototype.moveBack = function moveBack () {
    for (var i = 0; i < this.children.length; i++) {
      animate(this.children[i], 200, {
        x: -i / 4,
        y: -i / 4
      });
    }
  };

  return Deck;
}(Group));

var game = new Game({
  width: 1920,
  height: 1080
});

var deck = new Deck({
  x: 1920 / 2,
  y: 1080 / 2
});

game.add(deck);

deck.createCards(54, {
  style: 'standard',
  width: 100,
  height: 140
});

game.startRender(document.querySelector('#game'));
