export function render (game, container) {
  container.style.width = game.width + 'px';
  container.style.height = game.height + 'px';

  const entities = game.entities;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (!entity.el) {
      Object.defineProperties(entity, {
        el: {
          writable: true,
          value: entity.createEl()
        }
      });
      entity.created && entity.created();
    }

    entity.render(entity.el, entity);
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
