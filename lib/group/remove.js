export function remove (entity, animate) {
  const index = this.children.indexOf(entity);
  if (~index) {
    entity.x += this.x;
    entity.y += this.y;
    entity.group = null;
    this.children.splice(index, 1);
  }
  animate && this.moveBack(true);
}
