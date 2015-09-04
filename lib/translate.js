
import prefix from './prefix'

var transform = prefix('transform')
var $p = document.createElement('p')

document.body.appendChild($p)

$p.style[transform] = 'translate3d(1px,1px,1px)'

var has3d = $p.style[transform]

has3d = has3d != null && has3d.length && has3d !== 'none'

document.body.removeChild($p)

export default function (a, b, c) {
  c = c || 0
  if (has3d) {
    return 'translate3d(' + a + ', ' + b + ', ' + c + ')'
  } else {
    return 'translate(' + a + ', ' + b + ')'
  }
}
