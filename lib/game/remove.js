export function remove (item) {
  const index = this.children.indexOf(item);

  if (~index) {
    this.children.splice(index, 1);
    item.game = null;
  }
  return this;
}
