import { Deck } from '../deck/index.js';
import { moveBack } from './move-back.js';
import { shuffle } from './shuffle.js';

export class AnimatedDeck extends Deck {}

AnimatedDeck.prototype.moveBack = moveBack;
AnimatedDeck.prototype.shuffle = shuffle;

export * from './move-back.js';
export * from './shuffle.js';
