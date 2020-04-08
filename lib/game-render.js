export function render (game) {
  const { cards } = game;

  let traverse = game.container.firstChild;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const { graphics } = card;
    const { className } = graphics;

    while (traverse && (traverse.tagName !== 'img' || traverse.className !== className)) {
      const next = traverse.nextSibling;
      traverse.parentNode.removeChild(traverse);
      traverse = next;
    }

    if (!traverse || traverse.tagName !== 'IMG' || !traverse.className !== className) {
      traverse = document.createElement('img');
      traverse.className = className;
      game.container.appendChild(traverse);
    }

    const img = traverse;

    const { x, y, z, width, height, side } = card;
    const { back, front } = graphics;

    img.src = side === 'back' ? back : front[card.i];
    img.width = width;
    img.height = height;
    img.style.transform = `translate(${x - z / 4}px, ${y - z / 4}px)`;
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
