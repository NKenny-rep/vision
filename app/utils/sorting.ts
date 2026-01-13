/**
 * Sorting Utilities
 * Generic helper functions for sorting arrays of objects
 */

/**
 * Sort order type
 */
export type SortOrder = 'asc' | 'desc'

/**
 * Generic sort comparator function type
 */
export type SortComparator<T> = (a: T, b: T) => number

/**
 * Sort an array by a numeric property
 * @param items - Array to sort
 * @param key - Property name to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortByNumber<T>(
  items: T[],
  key: keyof T,
  order: SortOrder = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = Number(a[key]) || 0
    const bVal = Number(b[key]) || 0
    return order === 'asc' ? aVal - bVal : bVal - aVal
  })
}

/**
 * Sort an array by a string property
 * @param items - Array to sort
 * @param key - Property name to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortByString<T>(
  items: T[],
  key: keyof T,
  order: SortOrder = 'asc'
): T[] {
  return [...items].sort((a, b) => {
    const aVal = String(a[key] || '').toLowerCase()
    const bVal = String(b[key] || '').toLowerCase()
    const comparison = aVal.localeCompare(bVal)
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Sort an array by a date property
 * @param items - Array to sort
 * @param key - Property name to sort by
 * @param order - Sort order ('asc' or 'desc')
 * @returns Sorted array
 */
export function sortByDate<T, K extends keyof T>(
  items: T[],
  key: K extends (T[K] extends Date | string | number ? K : never) ? K : never, // Ensure T[K] is date-like
  order: SortOrder = 'desc'
): T[] {
  return [...items].sort((a, b) => {
    const aTime = new Date(a[key] as Date | string | number).getTime()
    const bTime = new Date(b[key] as Date | string | number).getTime()
    return order === 'asc' ? aTime - bTime : bTime - aTime
  })
}

/**
 * Sort an array by multiple criteria
 * @param items - Array to sort
 * @param comparators - Array of comparator functions
 * @returns Sorted array
 */
export function sortByMultiple<T>(
  items: T[],
  comparators: SortComparator<T>[]
): T[] {
  return [...items].sort((a, b) => {
    for (const comparator of comparators) {
      const result = comparator(a, b)
      if (result !== 0) return result
    }
    return 0
  })
}

/**
 * Create a comparator for sorting by a specific property
 * @param key - Property name to sort by
 * @param order - Sort order
 * @returns Comparator function
 */
export function createComparator<T>(
  key: keyof T,
  order: SortOrder = 'asc'
): SortComparator<T> {
  return (a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal === bVal) return 0
    
    let comparison = 0
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      comparison = aVal - bVal
    } else if (aVal instanceof Date && bVal instanceof Date) {
      comparison = aVal.getTime() - bVal.getTime()
    } else {
      comparison = String(aVal).localeCompare(String(bVal))
    }
    
    return order === 'asc' ? comparison : -comparison
  }
}

/**
 * Sort reviews by various criteria
 * @param reviews - Array of reviews
 * @param sortBy - Sort criteria
 * @returns Sorted reviews
 */
export function sortReviews<T extends { rating: number; createdAt: Date | string; likes?: number }>(
  reviews: T[],
  sortBy: 'recent' | 'rating' | 'helpful' | 'oldest' = 'recent'
): T[] {
  const sorted = [...reviews]
  
  switch (sortBy) {
    case 'recent':
      return sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    case 'oldest':
      return sorted.sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      )
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'helpful':
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0))
    default:
      return sorted
  }
}

/**
 * Sort movies/videos by various criteria
 * @param items - Array of movies/videos
 * @param sortBy - Sort criteria
 * @returns Sorted items
 */
export function sortMovies<T extends { 
  title?: string
  year?: number
  averageRating?: number
  views?: number
  createdAt?: Date | string
  releaseDate?: Date | string
}>(
  items: T[],
  sortBy: 'title' | 'year' | 'rating' | 'views' | 'date' | 'newest' | 'oldest' = 'title',
  order: SortOrder = 'desc'
): T[] {
  const sorted = [...items]
  
  switch (sortBy) {
    case 'title':
      return sorted.sort((a, b) => {
        const aTitle = (a.title || '').toLowerCase()
        const bTitle = (b.title || '').toLowerCase()
        return order === 'asc' 
          ? aTitle.localeCompare(bTitle)
          : bTitle.localeCompare(aTitle)
      })
    case 'year':
      return sorted.sort((a, b) => {
        const aYear = a.year || 0
        const bYear = b.year || 0
        return order === 'asc' ? aYear - bYear : bYear - aYear
      })
    case 'rating':
      return sorted.sort((a, b) => {
        const aRating = a.averageRating || 0
        const bRating = b.averageRating || 0
        return order === 'asc' ? aRating - bRating : bRating - aRating
      })
    case 'views':
      return sorted.sort((a, b) => {
        const aViews = a.views || 0
        const bViews = b.views || 0
        return order === 'asc' ? aViews - bViews : bViews - aViews
      })
    case 'newest':
    case 'date':
      return sorted.sort((a, b) => {
        const aDate = new Date(a.releaseDate || a.createdAt || 0).getTime()
        const bDate = new Date(b.releaseDate || b.createdAt || 0).getTime()
        return bDate - aDate
      })
    case 'oldest':
      return sorted.sort((a, b) => {
        const aDate = new Date(a.releaseDate || a.createdAt || 0).getTime()
        const bDate = new Date(b.releaseDate || b.createdAt || 0).getTime()
        return aDate - bDate
      })
    default:
      return sorted
  }
}

/**
 * Shuffle an array randomly
 * @param items - Array to shuffle
 * @returns Shuffled array
 */
export function shuffleArray<T>(items: T[]): T[] {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    if (shuffled[i] !== undefined && shuffled[j] !== undefined) {
      const temp = shuffled[i]
      shuffled[i] = shuffled[j]
      shuffled[j] = temp
    }
  }
  return shuffled
}

/**
 * Sort array and keep original indices
 * @param items - Array to sort
 * @param comparator - Sort comparator
 * @returns Array of objects with item and original index
 */
export function sortWithIndices<T>(
  items: T[],
  comparator: SortComparator<T>
): Array<{ item: T; originalIndex: number }> {
  return items
    .map((item, originalIndex) => ({ item, originalIndex }))
    .sort((a, b) => comparator(a.item, b.item))
}
