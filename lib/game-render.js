export function render (game) {
  const { cards } = game;

  let traverse = game.container.firstChild;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const { graphics } = card;
    const { className } = graphics;

    while (traverse && (traverse.tagName !== 'IMG')) {
      const next = traverse.nextSibling;
      traverse.parentNode.removeChild(traverse);
      traverse = next;
    }

    if (!traverse) {
      console.log('create element');
      traverse = document.createElement('img');
      traverse.className = className;
      traverse.draggable = false;
      game.container.appendChild(traverse);
    }

    const img = traverse;

    const { width, height, side } = card;
    const { back, front } = graphics;
    const { x, y } = game.getRenderPos(card);

    img.dataset.card = card.id;

    const src = side === 'back' ? back : front[card.i];
    const transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

    if (src !== img.dataset.src) {
      img.src = src;
      img.dataset.src = src;
    }
    if (width !== img.width) {
      img.width = width;
      img.style.marginLeft = -width / 2 + 'px';
    }
    if (height !== img.height) {
      img.height = height;
      img.style.marginTop = -height / 2 + 'px';
    }
    if (transform !== img.style.transform) {
      img.style.transform = transform;
    }

    traverse = traverse.nextSibling;
  }

  while (traverse) {
    const next = traverse.nextSibling;
    traverse.parentNode.removeChild(traverse);
    traverse = next;
  }
}
