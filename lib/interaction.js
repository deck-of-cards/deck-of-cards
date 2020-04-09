import { on, trigger } from './events.js';

export function interaction (game, renderer) {
  renderer.container.addEventListener('mousedown', onmousedown);
  renderer.container.addEventListener('touchstart', onmousedown);

  function onmousedown (e) {
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
      trigger(game, 'movestart', { card });

      const onmousemove = (e) => {
        const x = (e.touches ? e.touches[0] : e).pageX;
        const y = (e.touches ? e.touches[0] : e).pageY;

        trigger(game, 'move', {
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

        trigger(game, 'moveend', { card });
      };

      window.addEventListener('mousemove', onmousemove);
      window.addEventListener('mouseup', onmouseup);
      window.addEventListener('touchmove', onmousemove);
      window.addEventListener('touchend', onmouseup);
    }
  }
}
