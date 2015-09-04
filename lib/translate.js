
import prefix from './prefix'

var $p = document.createElement('p')
var transform = prefix('transform')

document.body.appendChild($p)

$p.style[transform] = 'translate3d(1px,1px,1px)'

var has3d = window.getComputedStyle($p).getPropertyValue(transform)

has3d = typeof has3d !== 'undefined' && has3d.length && has3d !== 'none'

console.log('3d support', has3d)

document.body.removeChild($p)

export default function (a, b, c) {
  c = c || 0
  if (has3d) {
    return 'translate3d(' + a + ', ' + b + ', ' + c + ')'
  } else {
    return 'translate(' + a + ', ' + b + ')'
  }
}
