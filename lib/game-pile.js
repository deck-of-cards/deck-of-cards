export function pile (game) {
  const { cards } = game;

  cards.sort((c1, c2) => {
    const { z: z1 } = game.getPos(c1);
    const { z: z2 } = game.getPos(c2);

    if (z1 > z2) {
      return 1;
    } else if (z2 > z1) {
      return -1;
    } else {
      return 0;
    }
  });
}
