
export default function (array) {
  var rnd, temp

  for (var i = array.length - 1; i; i--) {
    rnd = Math.round(Math.random() * i)
    temp = array[i]
    array[i] = array[rnd]
    array[rnd] = temp
  }

  return array
}
