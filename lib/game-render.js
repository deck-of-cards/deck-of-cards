export function render (game) {
  const { cards } = game;

  let traverse = game.container.firstChild;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const { graphics } = card;
    const { className } = graphics;

    while (traverse && (traverse.tagName !== 'IMG' || traverse.className !== className)) {
      const next = traverse.nextSibling;
      traverse.parentNode.removeChild(traverse);
      traverse = next;
    }

    if (!traverse) {
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

    img.src = side === 'back' ? back : front[card.i];
    img.width = width;
    img.height = height;
    img.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    img.style.marginLeft = -width / 2 + 'px';
    img.style.marginTop = -height / 2 + 'px';

    traverse = traverse.nextSibling;
  }

  while (traverse) {
    const next = traverse.nextSibling;
    traverse.parentNode.removeChild(traverse);
    traverse = next;
  }
}
