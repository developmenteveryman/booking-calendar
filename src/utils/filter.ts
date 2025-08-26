export function onlyDuplicates<T, K = T>(
    value: T,
    index: number,
    array: T[],
    keyExtractor?: (item: T) => K,
): boolean {
    const key = keyExtractor ? keyExtractor(value) : value;
    return array.some((otherValue, otherIndex) => {
        const otherKey = keyExtractor ? keyExtractor(otherValue) : otherValue;
        return otherKey === key && otherIndex !== index;
    });
}
