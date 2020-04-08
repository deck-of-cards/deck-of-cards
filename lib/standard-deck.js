const front = new Array(54);

for (let i = 0; i < front.length; i++) {
  front[i] = `standard-deck/front-${i}.png`;
}

export const standardDeck = {
  width: 102,
  height: 144,
  back: 'standard-deck/back.png',
  front
};
