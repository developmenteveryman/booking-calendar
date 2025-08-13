export function formattedPrice(price: number, options: Intl.NumberFormatOptions = {}): string {
  return price.toLocaleString('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    ...options,
  });
}
