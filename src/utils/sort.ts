export function sortByKey<T>(key: keyof T, order: 'asc' | 'desc' = 'asc') {
    return (a: T, b: T) => {
        return sortOrder(order)(a[key], b[key]);
    };
}

export function sortOrder<T>(order: 'asc' | 'desc' = 'asc') {
    return (a: T, b: T) => {
        if (a === b) return 0;
        if (order === 'asc') {
            return a > b ? 1 : -1;
        } else {
            return a < b ? 1 : -1;
        }
    };
}

export function objectToSortedArray<T>(
    obj: Record<string, T>,
    order: 'asc' | 'desc' = 'asc',
): Array<T> {
    const sortedKeys = Object.keys(obj).sort((a, b) => {
        if (order === 'asc') {
            return a.localeCompare(b);
        } else {
            return b.localeCompare(a);
        }
    });
    return sortedKeys.map((key) => obj[key]);
}
