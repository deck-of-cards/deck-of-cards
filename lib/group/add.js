export function add (entity, animate) {
  if (entity.length) {
    entity.forEach(entity => {
      this.add(entity, animate);
    });
    return this;
  }
  if (entity.group) {
    entity.group.remove(entity);
    entity.x -= this.x;
    entity.y -= this.y;
  } else if (entity.game) {
    entity.game.remove(entity);
    entity.x -= this.x;
    entity.y -= this.y;
  }
  entity.group = this;
  this.children.push(entity);
  animate !== false && (this.moveBack && this.moveBack(animate));
  return this;
}
