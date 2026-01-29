/**
 * Returns the poster URL for a movie.
 * If the provided URL is 'N/A' or empty, it returns a placeholder image.
 * @param url The URL of the poster.
 * @returns The poster URL or a placeholder.
 */

export const MOVIE_PLACEHOLDER_URL = 'https://placehold.co/300x450/0a0a0a/404040?text=No+Image&font=roboto';

export const getPosterUrl = (url?: string): string => {
  if (!url || url === 'N/A' || url.trim() === '') {
    return MOVIE_PLACEHOLDER_URL;
  }
  return url;
};