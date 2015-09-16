
export default {
  linear: function (t) {
    return t
  },
  quadIn: function (t) {
    return t * t
  },
  quadOut: function (t) {
    return t * (2 - t)
  },
  quadInOut: function (t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  },
  cubicIn: function (t) {
    return t * t * t
  },
  cubicOut: function (t) {
    return (--t) * t * t + 1
  },
  cubicInOut: function (t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  },
  quartIn: function (t) {
    return t * t * t * t
  },
  quartOut: function (t) {
    return 1 - (--t) * t * t * t
  },
  quartInOut: function (t) {
    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  },
  quintIn: function (t) {
    return t * t * t * t * t
  },
  quintOut: function (t) {
    return 1 + (--t) * t * t * t * t
  },
  quintInOut: function (t) {
    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
  }
}
