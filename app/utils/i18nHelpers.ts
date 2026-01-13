/**
 * i18n Utilities
 */

export const formatDate = (
  date: Date | string,
  locale: string = 'en',
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  }
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj)
}

export const formatNumber = (
  value: number,
  locale: string = 'en',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, options).format(value)
}

export const formatCurrency = (
  value: number,
  locale: string = 'en',
  currency: string = 'USD',
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    ...options
  }).format(value)
}

export const pluralize = (
  count: number,
  singular: string,
  plural?: string
): string => {
  if (count === 1) return singular
  return plural || `${singular}s`
}
