const animations = [];

export function animate (target, duration, properties, delay = 0) {
  const from = {};
  const to = {};

  for (const prop in properties) {
    from[prop] = target[prop];
    to[prop] = properties[prop];
    target[prop] = properties[prop];
  }

  const animation = {
    target,
    properties,
    duration,
    delay,
    from,
    to
  };

  animations.push(animation);

  return (cb) => {
    animation.cb = cb;
  };
}

export function getAnimatedProps (card) {
  const diff = {};
  const now = Date.now();

  for (let i = 0; i < animations.length; i++) {
    const animation = animations[i];

    if (animation.target !== card) {
      continue;
    }

    const { duration, delay, to } = animation;
    let { start, end, from } = animation;

    if (!start) {
      start = animation.start = delay + now;
      end = animation.end = start + duration;
    }

    for (const key in animation.properties) {
      diff[key] || (diff[key] = 0);

      if (now < start) {
        diff[key] += from[key] - to[key];
      } else if (now >= start && now <= end) {
        diff[key] += (end - Date.now()) / duration * (from[key] - to[key]);
      }
    }

    if (now >= end) {
      animation.cb && animation.cb();
      animations.splice(i--, 1);
    }
  }
  return diff;
}

export function all (animations, done) {
  let waiting = animations.length;

  animations.forEach(animation => {
    animation(cb => {
      waiting--;

      if (waiting === 0) {
        done();
      }
    });
  });
}
