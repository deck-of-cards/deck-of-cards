
import prefix from './prefix'

var has3d

export default function (a, b, c) {
  (typeof has3d !== 'undefined') || (has3d = check3d())

  c = c || 0

  if (has3d) {
    return 'translate3d(' + a + ', ' + b + ', ' + c + ')'
  } else {
    return 'translate(' + a + ', ' + b + ')'
  }
}

function check3d () {
  var transform = prefix('transform')
  var $p = document.createElement('p')

  document.body.appendChild($p)
  $p.style[transform] = 'translate3d(1px,1px,1px)'

  has3d = $p.style[transform]
  has3d = has3d != null && has3d.length && has3d !== 'none'

  document.body.removeChild($p)

  return has3d
}
