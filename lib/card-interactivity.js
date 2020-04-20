let touchEvents = false;

export function handleEvent (e) {
  if (e.type === 'mousedown' || e.type === 'touchstart') {
    if (touchEvents && e.type === 'mousedown') {
      this.el.removeEventListener('mousedown', this);
      return;
    }
    if (e.type === 'touchstart') {
      touchEvents = true;
    }
    const startPos = {
      x: (e.touches ? e.touches[0] : e).pageX,
      y: (e.touches ? e.touches[0] : e).pageY
    };
    const startTime = Date.now();

    this.preMove();

    let prevPos = startPos;
    let moved = false;
    const holdTimeout = setTimeout(() => {
      this.hold();
    }, 500);

    const move = (e) => {
      if (!moved) {
        clearTimeout(holdTimeout);
        this.startMove();
        moved = true;
      }

      const pos = {
        x: (e.touches ? e.touches[0] : e).pageX,
        y: (e.touches ? e.touches[0] : e).pageY
      };

      const delta = {
        x: pos.x - prevPos.x,
        y: pos.y - prevPos.y
      };

      this.move(delta);

      prevPos = pos;
    };

    const endmove = (e) => {
      const now = Date.now();

      if (!moved) {
        if (now - this._lastClick < 200) {
          this.dblClick();
        } else if (Date.now() - startTime < 200) {
          this.click();
        }
      }
      this._lastClick = now;
      this._moving = false;
      this._movingGroup = false;
      if (this.group) {
        this.group.children.forEach(item => {
          item._moving = false;
        });
      }
      clearTimeout(holdTimeout);
      if (moved) {
        this.endMove();
      }

      if (e.type === 'touchend') {
        window.removeEventListener('touchmove', move);
        window.removeEventListener('touchend', endmove);
      } else {
        window.removeEventListener('mousemove', move);
        window.removeEventListener('mouseup', endmove);
      }
    };

    if (e.type === 'touchstart') {
      window.addEventListener('touchmove', move);
      window.addEventListener('touchend', endmove);
    } else {
      window.addEventListener('mousemove', move);
      window.addEventListener('mouseup', endmove);
    }
  }
}
