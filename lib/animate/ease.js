const linear = (t) => t;

const easeInBy = (power) => (t) => Math.pow(t, power);
const easeOutBy = (power) => (t) => 1 - Math.abs(Math.pow(t - 1, power));

const easeInOutBy = (power) => (t) => {
  if (t < 0.5) {
    return easeInBy(power)(t * 2) / 2;
  } else {
    return easeOutBy(power)(t * 2 - 1) / 2 + 0.5;
  }
};

export default {
  linear,

  quadIn: easeInBy(2),
  quadOut: easeOutBy(2),
  quadInOut: easeInOutBy(2),
  cubicIn: easeInBy(3),
  cubicOut: easeOutBy(3),
  cubicInOut: easeInOutBy(3),
  quartIn: easeInBy(4),
  quartOut: easeOutBy(4),
  quartInOut: easeInOutBy(4),
  quintIn: easeInBy(5),
  quintOut: easeOutBy(5),
  quintInOut: easeInOutBy(5),

  sineIn: (t) => 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2),
  sineOut: (t) => Math.sin(Math.PI / 2 * t),
  sineInOut: (t) => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2,

  bounce (t) {
    const s = 7.5625;
    const p = 2.75;

    if (t < 1 / p) {
      return s * t * t;
    }
    if (t < 2 / p) {
      t -= 1.5 / p;
      return s * t * t + 0.75;
    }
    if (t < 2.5 / p) {
      t -= 2.25 / p;
      return s * t * t + 0.9375;
    }
    t -= 2.625 / p;
    return s * t * t + 0.984375;
  }
};
