
export default function () {
  return window.getComputedStyle(document.body).getPropertyValue('font-size').slice(0, -2)
}
