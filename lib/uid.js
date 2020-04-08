const chars = '0123456789abcdefghjkmnpqrstvwxyz';

export function generateUID (lookup) {
  let str = '';

  for (let i = 0; i < 10; i++) {
    str += chars[(Math.random() * 32) | 0];
  }
  const uid = str;

  while (lookup[uid]) {
    return generateUID(lookup);
  }

  return str;
}
