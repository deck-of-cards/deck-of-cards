
var memoized = {}

export default function (param) {
  if (typeof memoized[param] !== 'undefined') {
    return memoized[param]
  }

  var style = document.createElement('p').style

  if (typeof style[param] !== 'undefined') {
    memoized[param] = param
    return param
  }

  var camelCase = param[0].toUpperCase() + param.slice(1)

  var test = 'webkit' + camelCase

  if (typeof style[test] !== 'undefined') {
    memoized[param] = test
    return test
  }

  test = 'moz' + camelCase

  if (typeof style[test] !== 'undefined') {
    memoized[param] = test
    return test
  }

  test = 'Moz' + camelCase

  if (typeof style[test] !== 'undefined') {
    memoized[param] = test
    return test
  }

  test = 'o' + camelCase

  if (typeof style[test] !== 'undefined') {
    memoized[param] = test
    return test
  }

  test = 'ms' + camelCase

  if (typeof style[test] !== 'undefined') {
    memoized[param] = test
    return test
  }
}

