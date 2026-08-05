/** Replace `${name}` placeholders (Semi-style). Unknown keys stay as-is. */
export function interpolate(
  template: string,
  values: Record<string, string | number>
): string {
  return template.replace(/\$\{(\w+)\}/g, (match, key: string) => {
    const value = values[key];
    return value == null ? match : String(value);
  });
}
