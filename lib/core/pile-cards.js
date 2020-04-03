export function pileCards (cards, options = {}) {
  const x = options.x || 0;
  const y = options.y || 0;
  const xOffset = options.xOffset || options.offset || 0;
  const yOffset = options.yOffset || options.offset || 0;

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];

    card.x = Math.round(x - xOffset * i);
    card.y = Math.round(y - yOffset * i);
  }

  return cards;
}
