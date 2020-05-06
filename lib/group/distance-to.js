export function distanceTo (other) {
  return this.children.reduce((min, child) => {
    return Math.min(min, Math.sqrt(Math.pow(other.x - child.x, 2) + Math.pow(other.y - child.y, 2)));
  }, Infinity);
}
