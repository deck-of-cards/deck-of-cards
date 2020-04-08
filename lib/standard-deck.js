const front = new Array(54);

for (let i = 0; i < front.length; i++) {
  front[i] = `../../standard-deck/dist/front-${i}.png`;
}

export const standardDeck = {
  className: 'standard-card',
  width: 104,
  height: 144,
  back: '../../standard-deck/dist/back.png',
  front
};
