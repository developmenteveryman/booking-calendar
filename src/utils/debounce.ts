export default function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    const debounced = (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };

    debounced.cancel = () => {
        if (timeout) clearTimeout(timeout);
        timeout = undefined;
    };

    return debounced;
}
