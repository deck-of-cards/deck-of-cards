import { createStandardDeckWithJokers } from './core/standard-deck.js';
import { pileCards } from './core/pile-cards.js';

const cards = createStandardDeckWithJokers();
const $cards = document.createElement('div');

$cards.classList.add('cards');

document.body.appendChild($cards);

pileCards(cards, { offset: 0.25 });

cards.forEach(card => {
  const $card = document.createElement('div');
  const $cardBack = document.createElement('div');

  $card.classList.add('card');
  $cardBack.classList.add('card-back');

  $card.style.transform = `translate(${card.x}px, ${card.y}px)`;

  $cards.appendChild($card);
  $card.appendChild($cardBack);
});
