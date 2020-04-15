export const gameRenderer = {
  type: 'Game',
  renderGame (game, container) {
    const { width, height, children } = game;

    container.style.position = 'absolute';
    container.style.top = '50%';
    container.style.left = '50%';
    container.style.transform = `translate(${-width / 2}px, ${-height / 2}px)`;
    container.style.width = width + 'px';
    container.style.height = height + 'px';

    renderChildren(container, children);
  }
};

export function renderChildren (container, children) {
  let traverse = container.firstChild;

  for (let i = 0; i < children.length; i++) {
    const entity = children[i];

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
    const next = traverse.nextSibling;

    container.removeChild(traverse);

    traverse = next;
  }
}
