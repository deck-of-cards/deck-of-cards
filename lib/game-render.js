export function render (game) {
  const { cards } = game;

  let traverse = game.container.firstChild;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const { graphics } = card;

    while (traverse && (traverse.tagName !== 'IMG')) {
      const next = traverse.nextSibling;
      traverse.parentNode.removeChild(traverse);
      traverse = next;
    }

    if (!traverse) {
      traverse = document.createElement('img');
      traverse.draggable = false;
      traverse.style.touchAction = 'none';
      traverse.style.position = 'absolute';
      game.container.appendChild(traverse);
    }

    const img = traverse;

    const { width, height, side } = card;
    const { back, front } = graphics;
    const { x, y } = game.getPos(card, true);

    img.dataset.card = card.id;

    const src = side === 'back' ? back : front[card.i];
    const transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

    if (src !== img.dataset.src) {
      img.src = src;
      img.dataset.src = src;
    }
    if (width !== img.dataset.width) {
      img.width = width;
      img.style.marginLeft = -width / 2 + 'px';
      img.dataset.width = width;
    }
    if (height !== img.dataset.height) {
      img.height = height;
      img.style.marginTop = -height / 2 + 'px';
      img.dataset.height = height;
    }
    if (transform !== img.dataset.transform) {
      img.style.transform = transform;
      img.dataset.transform = transform;
    }

    traverse = traverse.nextSibling;
  }

  while (traverse) {
    const next = traverse.nextSibling;
    traverse.parentNode.removeChild(traverse);
    traverse = next;
  }
}
