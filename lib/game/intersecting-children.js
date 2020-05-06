export function intersectingChildren (other) {
  return this.children.filter(child => {
    return child.isIntersectingWith(other);
  });
}
