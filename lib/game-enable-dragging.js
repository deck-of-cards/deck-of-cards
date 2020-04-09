export function enableDragging (game) {
  game.container.onmousedown = game.container.ontouchstart = (e) => {
    const { target } = e;
    const { card: cardId } = target.dataset || {};

    if (!cardId) {
      return;
    }

    const prev = {
      x: (e.touches ? e.touches[0] : e).pageX,
      y: (e.touches ? e.touches[0] : e).pageY
    };

    const card = game.getCard(cardId);

    if (card) {
      game.onmovestart({ card });

      const onmousemove = (e) => {
        const x = (e.touches ? e.touches[0] : e).pageX;
        const y = (e.touches ? e.touches[0] : e).pageY;

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
        window.removeEventListener('touchmove', onmousemove);
        window.removeEventListener('touchend', onmouseup);

        game.onmoveend && game.onmoveend({ card });
      };

      window.addEventListener('mousemove', onmousemove);
      window.addEventListener('mouseup', onmouseup);
      window.addEventListener('touchmove', onmousemove);
      window.addEventListener('touchend', onmouseup);
    }
  };
}
