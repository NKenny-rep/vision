/**
 * Centralized toast notification composable
 * Provides consistent toast notifications across the application
 */
export const useToastNotification = () => {
  const toast = useToast()
  const { t } = useI18n()

  const defaultConfig = {
    timeout: 5000,
  }

  /**
   * Show a success toast notification
   * @param message - The message to display (can be a translation key or plain text)
   * @param title - Optional custom title (defaults to 'common.success')
   */
  const showSuccess = (message: string, title?: string) => {
    toast.add({
      title: title || t('common.success'),
      description: message,
      color: 'green',
      icon: 'i-heroicons-check-circle',
      ...defaultConfig,
    })
  }

  /**
   * Show an error toast notification
   * @param message - The error message to display (can be a translation key or plain text)
   * @param title - Optional custom title (defaults to 'common.error')
   */
  const showError = (message: string, title?: string) => {
    toast.add({
      title: title || t('common.error'),
      description: message,
      color: 'red',
      icon: 'i-heroicons-x-circle',
      ...defaultConfig,
    })
  }

  /**
   * Show an info toast notification
   * @param message - The info message to display
   * @param title - Optional custom title (defaults to 'common.info')
   */
  const showInfo = (message: string, title?: string) => {
    toast.add({
      title: title || t('common.info'),
      description: message,
      color: 'blue',
      icon: 'i-heroicons-information-circle',
      ...defaultConfig,
    })
  }

  /**
   * Show a warning toast notification
   * @param message - The warning message to display
   * @param title - Optional custom title (defaults to 'common.warning')
   */
  const showWarning = (message: string, title?: string) => {
    toast.add({
      title: title || t('common.warning'),
      description: message,
      color: 'orange',
      icon: 'i-heroicons-exclamation-triangle',
      ...defaultConfig,
    })
  }

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
  }
}
