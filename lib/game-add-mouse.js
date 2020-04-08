export function addMouse (game) {
  game.container.onmousedown = (e) => {
    const { target } = e;
    const { card: cardId } = target.dataset || {};

    if (!cardId) {
      return;
    }

    const prev = {
      x: e.pageX,
      y: e.pageY
    };

    const card = game.getCard(cardId);

    if (card) {
      game.onmovestart({ card });

      const onmousemove = (e) => {
        const x = e.pageX;
        const y = e.pageY;

        game.onmove({
          card,
          diff: {
            x: x - prev.x,
            y: y - prev.y
          }
        });

        prev.x = x;
        prev.y = y;
      };

      const onmouseup = (e) => {
        window.removeEventListener('mousemove', onmousemove);
        window.removeEventListener('mouseup', onmouseup);

        game.onmoveend && game.onmoveend({ card });
      };

      window.addEventListener('mousemove', onmousemove);
      window.addEventListener('mouseup', onmouseup);
    }
  };
}
