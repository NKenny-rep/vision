/**
 * Testing utilities and configuration
 * Centralized place for testing-related constants
 */

/**
 * 🧪 TESTING: Artificial delay to see skeleton loading states
 * 
 * Note: For pages using useAsyncData with lazy:true, use browser DevTools
 * network throttling instead of this delay to avoid SSR/hydration issues.
 * 
 * To test skeletons:
 * 1. Open DevTools → Network tab
 * 2. Set throttling to "Slow 3G" or "Fast 3G"
 * 3. Reload page to see skeleton states
 * 
 * This delay is primarily for composables that use $fetch directly
 * (like useReviews.getReviews)
 * 
 * @example
 * // 1.5 seconds delay for review loading
 * export const SKELETON_TESTING_DELAY_MS = 1500
 * 
 * // Disable delay
 * export const SKELETON_TESTING_DELAY_MS = 0
 */
export const SKELETON_TESTING_DELAY_MS = 1500  // Reviews only

/**
 * Helper function to apply testing delay
 * @returns Promise that resolves after SKELETON_TESTING_DELAY_MS
 */
export const applyTestingDelay = () => 
  new Promise(resolve => setTimeout(resolve, SKELETON_TESTING_DELAY_MS))
