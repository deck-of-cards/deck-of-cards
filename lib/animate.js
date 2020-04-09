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

export function animations (card, animate) {
  const now = Date.now();

  const diff = {};

  for (const key in animate) {
    const { duration, to } = animate[key];
    let { start, end, from } = animate[key];

    if (!start) {
      start = animate[key].start = Date.now();
      end = animate[key].end = start + duration;
    }

    if (now < end) {
      diff[key] = (end - Date.now()) / duration * (from - to);
    }
  }

  return diff;
}
