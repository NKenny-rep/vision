import type { Ref } from 'vue'

/*
 * Lazy Load Composable (Single Responsibility: infinite scroll logic)
 * Follows Interface Segregation and Dependency Inversion principles
 * 
 * @param loadMore Function to call when more items need to be loaded
 * @param options Configuration options
 * @returns Reactive state and control methods for lazy loading
 */

export interface UseLazyLoadOptions {
  /* Initial page number (default: 1) */
  initialPage?: number
  /* Root margin for intersection observer (default: '200px') */
  rootMargin?: string
  /* Threshold for intersection observer (default: 0.1) */
  threshold?: number
  /* Whether loading is complete (no more items) */
  hasMore?: Ref<boolean>
}

export interface UseLazyLoadReturn {
  /** Current page number */
  page: Readonly<Ref<number>>
  /** Whether items are currently loading */
  isLoading: Readonly<Ref<boolean>>
  /** Ref to attach to the sentinel element */
  sentinelRef: Ref<HTMLElement | null>
  /** Manually trigger loading next page */
  loadNext: () => Promise<void>
  /** Reset to initial state */
  reset: () => void
}

export const useLazyLoad = (
  loadMore: (page: number) => Promise<void>,
  options: UseLazyLoadOptions = {}
): UseLazyLoadReturn => {
  const {
    initialPage = 1,
    rootMargin = '200px',
    threshold = 0.1,
    hasMore = ref(true)
  } = options

  // State management (Single Responsibility)
  const page = ref(initialPage)
  const isLoading = ref(false)
  const sentinelRef = ref<HTMLElement | null>(null)
  
  let observer: IntersectionObserver | null = null

  const loadNext = async () => {
    if (isLoading.value || !hasMore.value) {
      return
    }

    isLoading.value = true

    try {
      await loadMore(page.value)
      page.value++
    } catch (error) {
      console.error('Failed to load more items:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const reset = () => {
    page.value = initialPage
    isLoading.value = false
    hasMore.value = true
  }

  const initObserver = () => {
    if (!sentinelRef.value || observer) {
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        // Trigger load when sentinel is visible
        if (entry && entry.isIntersecting && !isLoading.value && hasMore.value) {
          loadNext()
        }
      },
      {
        rootMargin,
        threshold
      }
    )

    observer.observe(sentinelRef.value)
  }

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  watch(sentinelRef, (newVal) => {
    cleanup()
    if (newVal) {
      initObserver()
    }
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    page: readonly(page),
    isLoading: readonly(isLoading),
    sentinelRef,
    loadNext,
    reset
  }
}
