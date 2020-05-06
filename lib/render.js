/* global requestAnimationFrame, cancelAnimationFrame */

export class Renderer {
  constructor (game, container) {
    this.game = game;
    this.container = container;
  }

  start () {
    if (this.rendering) {
      return;
    }
    this.rendering = requestAnimationFrame(() => {
      const { container } = this;
      this.rendering = null;
      this.start(container);
      this.render(container);
    });
  }

  render () {
    const { game, container } = this;
    render(game, container);
  }

  stop () {
    cancelAnimationFrame(this.rendering);
  }
}

export function render (game, container) {
  container.style.width = game.width + 'px';
  container.style.height = game.height + 'px';

  const entities = game.entities;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (!entity.el) {
      const el = entity.createEl && entity.createEl();
      if (el) {
        Object.defineProperties(entity, {
          el: {
            writable: true,
            value: el
          }
        });
      }
      entity.created && entity.created();
    }

    entity.render && entity.render(entity.el, entity);
  }

  let traverse = container.firstChild;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (entity.el) {
      if (traverse) {
        if (traverse === entity.el) {
          traverse = traverse.nextSibling;
          continue;
        } else {
          container.insertBefore(entity.el, traverse);
        }
      } else {
        container.appendChild(entity.el);
      }
    }
  }

  while (traverse) {
    const next = traverse.nextSibling;

    container.removeChild(traverse);

    traverse = next;
  }
}
