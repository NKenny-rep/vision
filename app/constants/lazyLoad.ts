export const LAZY_LOAD = {
  /** Number of items to load per page */
  ITEMS_PER_PAGE: 10,
  
  /** Root margin for IntersectionObserver */
  ROOT_MARGIN: '500px',
  
  /** Scroll threshold for backup scroll listener */
  SCROLL_THRESHOLD: 800,
  
  /** Intersection Observer threshold */
  OBSERVER_THRESHOLD: 0
} as const
