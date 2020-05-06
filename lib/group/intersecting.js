import { isEntitiesIntersecting } from '../intersecting.js';

export function isIntersectingWith (other) {
  if (other.children) {
    return this.children.find(child => {
      return other.children.find(child2 => {
        return isEntitiesIntersecting(child, child2);
      });
    });
  } else {
    return this.children.find(child => {
      return isEntitiesIntersecting(other, child);
    });
  }
}
