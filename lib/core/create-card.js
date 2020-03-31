export function createCard (index, options = {}) {
  const x = options.x || 0;
  const y = options.y || 0;
  const side = options.side || 0;
  const rotation = options.rotation || 0;

  return {
    x,
    y,
    side,
    rotation
  };
}
