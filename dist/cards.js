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

    if (entity$1.el) {
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

Game.prototype.intersectingChildren = function intersectingChildren (other) {
  return this.children.filter(function (child) {
    return child.isIntersectingWith(other);
  });
};

Game.prototype.stopRender = function stopRender () {
  cancelAnimationFrame(this.rendering);
};

Object.defineProperties( Game.prototype, prototypeAccessors );

function isIntersectingWith (r1, r2) {
  if (r1 === r2) {
    return false;
  }
  var x1 = (r1.absolutePosition || r1).x;
  var y1 = (r1.absolutePosition || r1).y;
  var w1 = r1.width;
  var h1 = r1.height;

  var x2 = (r2.absolutePosition || r2).x;
  var y2 = (r2.absolutePosition || r2).y;
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

Group.prototype.add = function add (entity, animate) {
  if (entity.group) {
    entity.group.remove(entity);
    entity.x -= this.x;
    entity.y -= this.y;
  } else if (entity.game) {
    entity.game.remove(entity);
    entity.x -= this.x;
    entity.y -= this.y;
  }
  entity.group = this;
  this.children.push(entity);
  animate && this.moveBack(true);
};

Group.prototype.remove = function remove (entity, animate) {
  var index = this.children.indexOf(entity);
  if (~index) {
    entity.x += this.x;
    entity.y += this.y;
    entity.group = null;
    this.children.splice(index, 1);
  }
  animate && this.moveBack(true);
};

Group.prototype.isIntersectingWith = function isIntersectingWith$1 (other) {
  if (other.children) {
    return this.children.find(function (child) {
      return other.children.find(function (child2) {
        return isIntersectingWith(child, child2);
      });
    });
  } else {
    return this.children.find(function (child) {
      return isIntersectingWith(other, child);
    });
  }
};

Group.prototype.distanceTo = function distanceTo (other) {
  return this.children.reduce(function (min, child) {
    return Math.min(min, Math.sqrt(Math.pow(other.x - child.x, 2) + Math.pow(other.y - child.y, 2)));
  }, Infinity);
};

var animations = [];

function animate (target, duration, properties, delay) {
  if ( delay === void 0 ) delay = 0;

  var from = {};
  var to = {};

  for (var prop in properties) {
    from[prop] = target[prop];
    to[prop] = properties[prop];
    target[prop] = properties[prop];
  }

  var animation = {
    target: target,
    properties: properties,
    duration: duration,
    delay: delay,
    from: from,
    to: to
  };

  animations.push(animation);

  return function (cb) {
    animation.cb = cb;
  };
}

function getAnimatedProps (card) {
  var diff = {};
  var now = Date.now();

  for (var i = 0; i < animations.length; i++) {
    var animation = animations[i];

    if (animation.target !== card) {
      continue;
    }

    var duration = animation.duration;
    var delay = animation.delay;
    var to = animation.to;
    var start = animation.start;
    var end = animation.end;
    var from = animation.from;

    if (!start) {
      start = animation.start = delay + now;
      end = animation.end = start + duration;
    }

    for (var key in animation.properties) {
      diff[key] || (diff[key] = 0);

      if (now < start) {
        diff[key] += from[key] - to[key];
      } else if (now >= start && now <= end) {
        diff[key] += (end - Date.now()) / duration * (from[key] - to[key]);
      }
    }

    if (now >= end) {
      animation.cb && animation.cb();
      animations.splice(i--, 1);
    }
  }
  return diff;
}

function all (animations, done) {
  var waiting = animations.length;

  animations.forEach(function (animation) {
    animation(function (cb) {
      waiting--;

      if (waiting === 0) {
        done();
      }
    });
  });
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
  var createEl = options.createEl;
  var render = options.render;

  this.type = type;
  this.style = style;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.createEl = createEl;
  this.render = render;

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

Entity.prototype.isIntersectingWith = function isIntersectingWith$1 (other) {
  if (other.children) {
    return other.isIntersectingWith(this);
  } else {
    return isIntersectingWith(this, other);
  }
};

prototypeAccessors$1.game.set = function (game) {
  this._game = game;
};

prototypeAccessors$1.game.get = function () {
  return this.group ? this.group.game : this._game;
};

Object.defineProperties( Entity.prototype, prototypeAccessors$1 );

var Pile = /*@__PURE__*/(function (Group) {
  function Pile (options) {
    if ( options === void 0 ) options = {};

    var dir = options.dir;
    Group.call(this, Object.assign({}, options,
      {type: 'Pile'}));
    this.dir = dir;
  }

  if ( Group ) Pile.__proto__ = Group;
  Pile.prototype = Object.create( Group && Group.prototype );
  Pile.prototype.constructor = Pile;

  Pile.prototype.moveBack = function moveBack () {
    var ref = this;
    var dir = ref.dir;

    for (var i = 0; i < this.children.length; i++) {
      animate(this.children[i], 200, {
        x: dir === 'horizontal' ? 15 * i : 0,
        y: dir === 'vertical' ? 30 * i : 0
      });
    }
  };

  return Pile;
}(Group));

var Card = /*@__PURE__*/(function (Entity) {
  function Card (options) {
    if ( options === void 0 ) options = {};

    Entity.call(this, Object.assign({}, options,
      {type: 'Card'}));
    var i = options.i;
    var side = options.side;

    this.i = i;
    this.side = side;

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

  Card.prototype.dblClick = function dblClick () {
    if (this.group && this.group.type === 'Deck') {
      this.group.shuffle();
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

      var ref = this;
      var group = ref.group;

      if (group) {
        if (!group.isIntersectingWith(this)) {
          group.remove(this, true);
          group.game.add(this);
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
        this.group.moveBack(true);
      } else {
        var intersectingEntities = this.game.intersectingChildren(this);

        intersectingEntities.sort(function (a, b) {
          return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
        });

        var closest = intersectingEntities[0];

        if (!closest) {
          return;
        }

        if (closest.children) {
          if (closest.type === 'Pile' && closest.children.length === 1) {
            var diff = {
              x: Math.abs(closest.x - this.x),
              y: Math.abs(closest.y - this.y)
            };
            closest.dir = diff.y > diff.x ? 'vertical' : 'horizontal';
          }
          closest.add(this, true);
        } else {
          var diff$1 = {
            x: Math.abs(closest.x - this.x),
            y: Math.abs(closest.y - this.y)
          };
          var pile = new Pile({
            game: this.game,
            dir: diff$1.y > diff$1.x ? 'vertical' : 'horizontal'
          });
          pile.x = closest.x;
          pile.y = closest.y;
          pile.add(closest);
          pile.add(this, true);
          this.game.add(pile);
        }
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

      var now = Date.now();

      if (now - this._lastClick < 500) {
        this.dblClick();
      }

      this._lastClick = now;

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
        this$1._moving = false;
        this$1._movingGroup = false;
        if (this$1.group) {
          this$1.group.children.forEach(function (item) {
            item._moving = false;
          });
        }
        clearTimeout(holdTimeout);
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

  return Card;
}(Entity));

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

var Deck = /*@__PURE__*/(function (Group) {
  function Deck (options) {
    if ( options === void 0 ) options = {};

    Group.call(this, Object.assign({}, options,
      {type: 'Deck'}));
  }

  if ( Group ) Deck.__proto__ = Group;
  Deck.prototype = Object.create( Group && Group.prototype );
  Deck.prototype.constructor = Deck;

  Deck.prototype.createCards = function createCards (count, options, options2) {
    for (var i = 0; i < count; i++) {
      var card = new Card(Object.assign({}, options,
        options2,
        {i: count - i - 1,
        x: -i / 4,
        y: -i / 4}));
      this.add(card);
    }

    return this;
  };

  Deck.prototype.moveBack = function moveBack (withAnimation) {
    for (var i = 0; i < this.children.length; i++) {
      var target = {
        x: -i / 4,
        y: -i / 4
      };
      if (withAnimation) {
        animate(this.children[i], 200, target);
      } else {
        this.children[i].x = target.x;
        this.children[i].y = target.y;
      }
    }
  };

  Deck.prototype.shuffle = function shuffle$1 () {
    var this$1 = this;

    var shuffled = shuffle(this.children.slice());
    var left = [];
    var right = [];

    for (var i = 0; i < this.children.length; i++) {
      var child = this.children[i];

      if (Math.round(Math.random())) {
        right.push(child);
      } else {
        left.push(child);
      }
    }

    var animations = [];

    var rate = 1;

    for (var i$1 = 0; i$1 < left.length || i$1 < right.length; i$1++) {
      if (i$1 < left.length) {
        var card = left[i$1];
        animations.push(animate(card, 200 * rate, {
          x: -60 + 15 * Math.random(),
          y: -i$1 / 2
        }, i$1 * 3 * rate));
      }

      if (i$1 < right.length) {
        var card$1 = right[i$1];
        animations.push(animate(card$1, 200 * rate, {
          x: 60 + 15 * Math.random(),
          y: -i$1 / 2
        }, i$1 * 3 * rate));
      }
    }
    all(animations, function () {
      var i = 0;
      var animations = [];
      while (left.length || right.length) {
        var random = Math.round(Math.random());
        var card = random
          ? (left.shift() || right.shift())
          : (right.shift() || left.shift());

        animations.push(animate(card, 150 * rate, {
          x: -i / 4,
          y: -i / 4
        }, i * 5 * rate));
        i++;
      }

      all(animations, function () {
        for (var i = 0; i < this$1.children.length; i++) {
          this$1.children[i].i = shuffled[i].i;
          this$1.children[i].x = -i / 4;
          this$1.children[i].y = -i / 4;
        }
      });
    });
  };

  return Deck;
}(Group));

var standardDeck = {
  style: 'standard',
  width: 100,
  height: 140,
  side: 'front',
  createEl: function createEl () {
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
  },
  render: function render () {
    var ref = this;
    var i = ref.i;
    var width = ref.width;
    var height = ref.height;
    var side = ref.side;
    var absolutePosition = ref.absolutePosition;
    var _moving = ref._moving;
    var x = absolutePosition.x;
    var y = absolutePosition.y;

    this.el.style.transform = "translate(" + (Math.round(x)) + "px, " + (Math.round(y)) + "px)";
    this.el.style.width = width + 'px';
    this.el.style.height = height + 'px';
    this.el.style.marginLeft = -width / 2 + 'px';
    this.el.style.marginTop = -height / 2 + 'px';
    if (side === 'front') {
      this.el.style.backgroundImage = "url(standard-deck/front-" + i + ".png)";
    } else {
      this.el.style.backgroundImage = 'url(standard-deck/back.png)';
    }
    if (_moving) {
      this.el.style.boxShadow = '0px 2px 5px rgba(0, 0, 0, 0.25)';
    } else {
      this.el.style.boxShadow = '0px 1px 1px rgba(0, 0, 0, 0.05)';
    }
  }
};

var game = new Game({
  width: 1920,
  height: 1080
});

var deck = new Deck({
  x: 1920 / 2,
  y: 1080 / 2
});

game.add(deck);

deck.createCards(54, standardDeck, {
  side: 'front'
});

game.startRender(document.querySelector('#game'));
