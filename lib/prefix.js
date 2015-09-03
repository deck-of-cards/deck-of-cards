
var style = document.createElement('p').style
var memoized = {}

export default function (param) {
  if (typeof memoized[param] !== 'undefined') {
    return memoized[param]
  }

  if (typeof style[param] !== 'undefined') {
    memoized[param] = param
    return param
  }

  var camelCase = param[0].toUpperCase() + param.slice(1)
  var prefixes = ['webkit', 'moz', 'Moz', 'ms', 'o']
  var test

  for (var i = 0, len = prefixes.length; i < len; i++) {
    test = prefixes[i] + camelCase
    if (typeof style[test] !== 'undefined') {
      memoized[param] = test
      return test
    }
  }
}

