/**
 * Async operation wrapper utility
 * Provides consistent error handling pattern following DRY principle
 */

interface AsyncOperationOptions<T> {
  operation: () => Promise<T>
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  loadingRef?: Ref<boolean>
  errorRef?: Ref<string | null>
}

/**
 * Wraps async operations with consistent loading and error handling
 */
export const withAsyncHandler = async <T>({
  operation,
  onSuccess,
  onError,
  loadingRef,
  errorRef,
}: AsyncOperationOptions<T>): Promise<T | null> => {
  if (loadingRef) loadingRef.value = true
  if (errorRef) errorRef.value = null

  try {
    const result = await operation()
    if (onSuccess) onSuccess(result)
    return result
  } catch (e) {
    const error = e instanceof Error ? e : new Error('An error occurred')
    if (errorRef) {
      errorRef.value = error.message
    }
    if (onError) {
      onError(error)
    }
    return null
  } finally {
    if (loadingRef) loadingRef.value = false
  }
}

/**
 * Extracts error message from unknown error type
 */
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An error occurred'
}
