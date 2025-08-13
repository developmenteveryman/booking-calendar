/**
 * Replaces placeholders in the endpoint template with provided parameters.
 *
 * @param stringWithPlaceholders The string we are replacing placeholdes in (e.g., '/{type}/{id}')
 * @param replacements An object with key-value pairs to substitute into the string
 * @returns The endpoint with placeholders replaced by the provided values.
 */
export default function replacePlaceholders(
  stringWithPlaceholders: string,
  replacements: Record<string, string>,
  matcher: RegExp = /{(\w+)}/g,
): string {
  return stringWithPlaceholders.replace(matcher, (match, key) => {
    return key in replacements ? replacements[key] : match;
  });
}
