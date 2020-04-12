import { on, trigger } from './events.js';

export function mouse (game, renderer) {
  on(game, 'mousedown', onmousedown);

  function onmousedown ({ view, e }) {
    const { id } = view;

    if (!id) {
      return;
    }

    const prev = {
      x: (e.touches ? e.touches[0] : e).pageX,
      y: (e.touches ? e.touches[0] : e).pageY
    };

    const card = game.getCard(id);

    if (card) {
      trigger(game, 'cardmovestart', { card });

      const onmousemove = (e) => {
        const x = (e.touches ? e.touches[0] : e).pageX;
        const y = (e.touches ? e.touches[0] : e).pageY;

        trigger(game, 'cardmove', {
          card,
          x: x - prev.x,
          y: y - prev.y
        }
        );

        prev.x = x;
        prev.y = y;
      };

      const onmouseup = (e) => {
        window.removeEventListener('mousemove', onmousemove);
        window.removeEventListener('touchmove', onmousemove);

        window.removeEventListener('mouseup', onmouseup);
        window.removeEventListener('touchend', onmouseup);

        trigger(game, 'cardmoveend', { card });
      };

      window.addEventListener('mousemove', onmousemove);
      window.addEventListener('touchmove', onmousemove);

      window.addEventListener('mouseup', onmouseup);
      window.addEventListener('touchend', onmouseup);
    }
  }
}
