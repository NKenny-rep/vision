/**
 * Returns the poster URL for a movie.
 * If the provided URL is 'N/A' or empty, it returns a placeholder image.
 * @param url The URL of the poster.
 * @returns The poster URL or a placeholder.
 */
export const getPosterUrl = (url?: string): string => {
  if (url && url !== 'N/A') {
    return url;
  }
  return '/placeholder-movie.jpg';
};