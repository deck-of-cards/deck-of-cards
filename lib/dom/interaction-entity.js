export const entityInteraction = {
  createEl (entity) {
    entity.el.addEventListener('mousedown', startmove);
    entity.el.addEventListener('touchstart', startmove);

    function startmove (e) {
      const startPos = {
        x: e.touches ? e.touches[0].pageX : e.pageX,
        y: e.touches ? e.touches[0].pageY : e.pageY
      };
      const longpressDelay = setTimeout(() => {
        entity.trigger('holdmove');
      }, 500);
      entity.trigger('startmove', startPos);

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', endmove);

      window.addEventListener('touchmove', move);
      window.addEventListener('touchend', endmove);

      let prevPos = startPos;

      function move (e) {
        const pos = {
          x: e.touches ? e.touches[0].pageX : e.pageX,
          y: e.touches ? e.touches[0].pageY : e.pageY
        };

        const diff = {
          x: pos.x - startPos.x,
          y: pos.y - startPos.y
        };

        if (Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))) {
          clearTimeout(longpressDelay);
        }

        const delta = {
          x: pos.x - prevPos.x,
          y: pos.y - prevPos.y
        };

        prevPos = pos;

        entity.trigger('move', pos, delta, diff, startPos);
      }

      function endmove (e) {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', endmove);

        window.removeEventListener('touchmove', move);
        window.removeEventListener('touchend', endmove);

        entity.trigger('endmove', prevPos, startPos);
      }
    }
  }
};
