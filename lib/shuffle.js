export function shuffle (array) {
  if (!array.length) {
    return array;
  }
  for (let i = array.length - 1; i; i--) {
    const rnd = Math.floor(Math.random() * (i + 1));
    const temp = array[i];

    array[i] = array[rnd];
    array[rnd] = temp;
  }

  return array;
}
