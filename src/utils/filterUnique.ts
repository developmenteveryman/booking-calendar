function filterUnique<T>(keys: (keyof T)[]): (value: T, index: number, array: T[]) => boolean {
  const seen = new Set<string>();
  return (value) => {
    const uniqueKey = keys.map((key) => String(value[key])).join('|');
    if (seen.has(uniqueKey)) return false;
    seen.add(uniqueKey);
    return true;
  };
}

export default filterUnique;
