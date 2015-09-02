
var memoized = {}

export default function (param) {
  if (typeof memoized[param] !== 'undefined') {
    return memoized[param]
  }
  var body = document.body
  var camelCase = param[0].toUpperCase() + param.slice(1)
  if (typeof body[param] !== 'undefined') {
    memoized[param] = param
    return param
  }
  var test = 'webkit' + camelCase
  if (test) {
    memoized[param] = test
    return test
  }
  test = 'moz' + camelCase
  if (test) {
    memoized[param] = test
    return test
  }
  test = 'o' + camelCase
  if (test) {
    memoized[param] = test
    return test
  }
  test = 'ms' + camelCase
  if (test) {
    memoized[param] = test
    return test
  }
}

