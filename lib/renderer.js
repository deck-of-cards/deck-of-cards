export class Renderer {
  constructor ({ game }) {
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
  }

  mountTo (parent) {
    parent.appendChild(this.container);
  }

  render () {
    const { game, container } = this;
    const { cards } = game;

    const views = new Array(cards.length);
    const viewsLookup = {};

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const { id, graphics } = card;
      const { View } = graphics;

      const view = this.viewsLookup[id] || createView(View, game);
      view.id = id;
      views[i] = view;
      viewsLookup[id] = view;

      view.update(card);
    }

    let traverse = container.firstChild;

    for (let i = 0; i < views.length; i++) {
      const view = views[i];

      if (traverse === view.el) {
        traverse = traverse.nextSibling;
      } else if (traverse) {
        container.insertBefore(view.el, traverse);
      } else {
        container.appendChild(view.el);
      }
    }

    this.views = views;
    this.viewsLookup = viewsLookup;
  }
}

function createView (View, game) {
  const view = new View({ game });

  view.el.addEventListener('mousedown', ondown);
  view.el.addEventListener('touchstart', ondown);

  return view;

  function ondown (e) {
    game.trigger('cardmousedown', { view, e });
  }
}
