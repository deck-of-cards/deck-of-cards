import { Group } from '../group/index.js';

export class Deck extends Group {
  constructor (options = {}) {
    super({
      ...options,
      type: 'Deck'
    });
  }
}
