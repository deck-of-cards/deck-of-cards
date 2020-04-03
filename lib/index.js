import { createStandardDeckWithJokers } from './core/standard-deck.js';
import { shuffle } from './core/shuffle.js';
import { pileCards } from './core/pile-cards.js';

const cards = createStandardDeckWithJokers();
const $cards = document.createElement('div');

$cards.classList.add('cards');

document.body.appendChild($cards);

shuffle(cards);

pileCards(cards, { offset: 0.25 });

cards.forEach(card => {
  const $card = document.createElement('div');
  const $cardBack = document.createElement('div');
  const $cardFront = document.createElement('div');

  $card.classList.add('card');
  $cardBack.classList.add('card-back');
  $cardFront.classList.add('card-front');

  $card.style.transform = `translate(${card.x}px, ${card.y}px)`;

  $cardFront.style.backgroundImage = `url(img/standard-deck/${card.index}.jpg)`;

  $cards.appendChild($card);
  $card.appendChild($cardBack);
  $card.appendChild($cardFront);
});
