export function add (item) {
  if (item.length) {
    item.forEach(item => {
      this.add(item);
    });
    return this;
  }
  if (item.game) {
    item.game.remove(item);
  }
  if (item.group) {
    item.group.remove(item);
  }
  this.children.push(item);
  item.game = this;
  return this;
}
