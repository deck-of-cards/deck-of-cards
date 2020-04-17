import { Group } from './group.js';

export class Pile extends Group {
  constructor (options = {}) {
    super({
      ...options,
      type: 'Pile'
    });
  }
}
