export const cardRenderer = {
  type: 'Card',
  startmove (card) {
    card.el.style.boxShadow = '0 3px 5px rgba(0, 0, 0, .15)';
  },
  holdmove (card) {
    if (card.parent && card.parent !== 'Game') {
      card.el.style.boxShadow = '0 1px 1px rgba(0, 0, 0, .05)';
      card.parent.children[0].el.style.boxShadow = '0 3px 5px rgba(0, 0, 0, .15)';
    }
  },
  endmove (card) {
    card.el.style.boxShadow = '0 1px 1px rgba(0, 0, 0, .05)';
    if (card.parent && card.parent !== 'Game') {
      card.parent.children[0].el.style.boxShadow = '0 1px 1px rgba(0, 0, 0, .05)';
    }
  },
  createEl (card) {
    card.el = document.createElement('div');
    card.el.style.position = 'absolute';
    card.el.style.backgroundPosition = '50% 50%';
    card.el.style.backgroundRepeat = 'no-repeat';
    card.el.style.backgroundSize = 'contain';
    card.el.style.backgroundColor = '#fff';
    card.el.style.borderRadius = `${6 / 1}% ${6 / 1.4}%`;
    card.el.style.boxShadow = '0 1px 1px rgba(0, 0, 0, .05)';
    card.el.style.overflow = 'hidden';
    card.el.style.willChange = 'transform';
  },
  render (card) {
    const { i, side, el, width, height } = card;
    const { x, y } = card.animatedPosition;

    el.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px)`;
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.marginLeft = -width / 2 + 'px';
    el.style.marginTop = -height / 2 + 'px';

    if (side === 'front') {
      el.style.backgroundImage = `url(standard-deck/front-${i}.png)`;
    } else {
      el.style.backgroundImage = 'url(standard-deck/back.png)';
    }
  }
};
