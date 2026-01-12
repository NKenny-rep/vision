import * as z from 'zod'

export interface RegistrationFormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  avatar: string
  planId: number | null
}

export const useRegistrationForm = () => {
  const { t } = useI18n()
  const toast = useToast()
  const localePath = useLocalePath()

  // Form state
  const formData = ref<RegistrationFormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    avatar: '',
    planId: null,
  })

  const isSubmitting = ref(false)

  // Validation schema
  const createSchema = () => z.object({
    name: z.string().min(1, t('auth.register.nameRequired')),
    email: z.string().email(t('auth.login.emailInvalid')),
    phone: z.string().optional(),
    password: z.string().min(8, t('auth.login.passwordMinLength')),
    confirmPassword: z.string(),
    avatar: z.string().optional(),
    planId: z.number({ message: t('auth.register.planRequired') }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('auth.register.passwordsNotMatch'),
    path: ['confirmPassword'],
  })

  // Validate form data
  const validate = () => {
    try {
      const schema = createSchema()
      return { success: true, data: schema.parse(formData.value) }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.issues[0]?.message }
      }
      return { success: false, error: t('common.error') }
    }
  }

  // Submit handler
  const submit = async () => {
    const validation = validate()
    
    if (!validation.success) {
      toast.add({
        title: t('common.error'),
        description: validation.error
      })
      return { success: false }
    }

    isSubmitting.value = true

    try {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: {
          name: validation.data.name,
          email: validation.data.email,
          phone: validation.data.phone || undefined,
          password: validation.data.password,
          avatar: validation.data.avatar || undefined,
          planId: validation.data.planId,
        }
      })

      // Save email for login auto-fill
      const emailCookie = useCookie<string>('login_email', {
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30,
      })
      emailCookie.value = validation.data.email

      toast.add({
        title: t('common.success'),
        description: t('auth.register.success')
      })

      await navigateTo(localePath('/browse'))
      return { success: true }
    } catch (error: any) {
      toast.add({
        title: t('common.error'),
        description: error.data?.message || t('auth.register.failed')
      })
      return { success: false }
    } finally {
      isSubmitting.value = false
    }
  }

  // Initialize email from cookie if available
  const initializeFromCookie = () => {
    const emailCookie = useCookie<string | null>('login_email')
    if (emailCookie.value) {
      formData.value.email = emailCookie.value
    }
  }

  return {
    formData,
    isSubmitting,
    validate,
    submit,
    initializeFromCookie,
  }
}
