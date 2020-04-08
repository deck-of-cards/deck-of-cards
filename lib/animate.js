export function animate (target, duration, properties) {
  target.animate || (target.animate = {});

  for (const prop in properties) {
    target.animate[prop] = {
      duration,
      from: target[prop],
      to: properties[prop]
    };

    target[prop] = properties[prop];
  }
}
