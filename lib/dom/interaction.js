export const interaction = {
  createEl (entity) {
    entity.el.addEventListener('mousedown', startmove);

    function startmove (e) {
      const startPos = {
        x: e.touches ? e.touches[0].pageX : e.pageX,
        y: e.touches ? e.touches[0].pageY : e.pageY
      };
      entity.trigger('startmove', startPos);

      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', endmove);

      window.addEventListener('touchmove', move);
      window.addEventListener('touchend', endmove);

      const pos = {
        x: startPos.x,
        y: startPos.y
      };

      function move (e) {
        pos.x = e.touches ? e.touches[0].pageX : e.pageX;
        pos.y = e.touches ? e.touches[0].pageY : e.pageY;

        const diff = {
          x: pos.x - startPos.x,
          y: pos.y - startPos.y
        };

        entity.trigger('move', pos, diff, startPos);
      }

      function endmove (e) {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', endmove);

        window.removeEventListener('touchmove', move);
        window.removeEventListener('touchend', endmove);

        entity.trigger('endmove');
      }
    }
  }
};
