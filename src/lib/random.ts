const HASH_BASE = 31;

export const hashString = (input: string): number => {
  let hash = 0;

  for (const character of input) {
    hash = (hash * HASH_BASE + character.charCodeAt(0)) >>> 0;
  }

  return hash;
};

export const pickBySeed = <Item>(
  items: Item[],
  seed: string,
  salt = '',
): Item => {
  const index = hashString(`${seed}:${salt}`) % items.length;
  return items[index];
};

export const seededJitter = (seed: string, salt: string): number => {
  return (hashString(`${seed}:${salt}`) % 1000) / 1000;
};
