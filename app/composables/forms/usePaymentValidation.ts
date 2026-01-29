import { z } from 'zod'

// Helper to get current year and month
const getCurrentYearMonth = () => {
  const now = new Date()
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
  }
}

// Zod schema for payment method validation
export const paymentMethodSchema = z.object({
  paymentTypeId: z.number().int().positive(),
  cardBrand: z.string().min(1, 'Card brand is required'),
  cardLast4: z.string()
    .length(4, 'Card last 4 digits must be exactly 4 characters')
    .regex(/^\d{4}$/, 'Card last 4 digits must be numeric'),
  expiryMonth: z.string()
    .min(1, 'Expiry month is required')
    .regex(/^(0[1-9]|1[0-2])$/, 'Invalid month format'),
  expiryYear: z.string()
    .min(4, 'Expiry year is required')
    .regex(/^\d{4}$/, 'Invalid year format')
    .refine((year) => {
      const yearNum = parseInt(year, 10)
      return yearNum >= getCurrentYearMonth().year
    }, 'Expiry year cannot be in the past'),
  isDefault: z.boolean(),
}).refine((data) => {
  // Custom refinement for expiry date validation
  const expiryMonth = parseInt(data.expiryMonth, 10)
  const expiryYear = parseInt(data.expiryYear, 10)
  const { year: currentYear, month: currentMonth } = getCurrentYearMonth()
  
  // If same year, month must be current or future
  if (expiryYear === currentYear && expiryMonth < currentMonth) {
    return false
  }
  
  return true
}, {
  message: 'Card has expired',
  path: ['expiryMonth'], // Attach error to expiryMonth field
})

// Infer TypeScript type from Zod schema
export type PaymentMethodData = z.infer<typeof paymentMethodSchema>

export const usePaymentValidation = () => {
  const { t } = useI18n()

  const validatePaymentData = (data: unknown) => {
    return paymentMethodSchema.safeParse(data)
  }

  const getFieldErrorMessage = (fieldName: keyof PaymentMethodData, errors: z.ZodError): string | null => {
    const fieldError = errors.issues.find(err => err.path[0] === fieldName)
    if (!fieldError) return null

    // Translate field name
    const fieldTranslations: Record<string, string> = {
      cardBrand: t('profile.cardBrand'),
      cardLast4: t('profile.cardLast4'),
      expiryMonth: t('profile.expiryMonth'),
      expiryYear: t('profile.expiryYear'),
    }

    const fieldLabel = fieldTranslations[fieldName] || fieldName

    // Return custom message or default with field label
    if (fieldError.message === 'Required') {
      return `${fieldLabel} ${t('common.isRequired')}`
    }

    return fieldError.message.replace(fieldName, fieldLabel)
  }

  const getAllErrorMessages = (errors: z.ZodError): string[] => {
    return errors.issues.map(err => {
      const fieldName = err.path[0] as string
      const fieldTranslations: Record<string, string> = {
        cardBrand: t('profile.cardBrand'),
        cardLast4: t('profile.cardLast4'),
        expiryMonth: t('profile.expiryMonth'),
        expiryYear: t('profile.expiryYear'),
      }

      const fieldLabel = fieldTranslations[fieldName] || fieldName
      
      if (err.message === 'Required') {
        return `${fieldLabel} ${t('common.isRequired')}`
      }

      return err.message
    })
  }

  /**
   * Validate and return first error message (for toast notifications)
   */
  const getFirstError = (data: unknown): string | null => {
    const result = validatePaymentData(data)
    if (result.success) return null
    
    const messages = getAllErrorMessages(result.error)
    return messages[0] || 'Validation failed'
  }

  /**
   * Check if payment data is valid (boolean)
   */
  const isPaymentValid = (data: unknown): boolean => {
    const result = validatePaymentData(data)
    return result.success
  }

  return {
    paymentMethodSchema,
    validatePaymentData,
    getFieldErrorMessage,
    getAllErrorMessages,
    getFirstError,
    isPaymentValid,
  }
}
