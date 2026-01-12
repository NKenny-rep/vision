/**
 * Capitalizes the first letter of each word in a string
 * @param name - The name to capitalize
 * @returns The formatted name with each word capitalized
 * @example capitalizeWords("john doe") => "John Doe"
 */
export function capitalizeWords(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
