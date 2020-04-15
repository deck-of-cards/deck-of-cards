export function findMiddleware (entity) {
  return entity.game.middleware.filter(middleware => {
    const { type, style } = middleware;

    if (style) {
      if (style !== entity.style) {
        return false;
      } else if (type !== entity.type) {
        return false;
      }
    } else if (type) {
      if (type !== entity.type) {
        return false;
      }
    }
    return true;
  });
}
