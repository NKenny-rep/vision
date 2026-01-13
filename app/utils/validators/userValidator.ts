import type { UserFormData } from '~/types'

export interface ValidationErrors {
  name?: string
  email?: string
  password?: string
  phone?: string
  roleId?: string
}

export interface IUserValidator {
  validate(data: UserFormData, isEdit: boolean): ValidationErrors
  validateField<K extends keyof UserFormData>(field: K, value: UserFormData[K], isEdit: boolean): string | undefined
}

export class UserFormValidator implements IUserValidator {
  private readonly t: (key: string) => string

  constructor(t: (key: string) => string) {
    this.t = t
  }

  validate(data: UserFormData, isEdit: boolean = false): ValidationErrors {
    const errors: ValidationErrors = {}

    const nameError = this.validateName(data.name)
    if (nameError) errors.name = nameError

    const emailError = this.validateEmail(data.email)
    if (emailError) errors.email = emailError

    const passwordError = this.validatePassword(data.password, isEdit)
    if (passwordError) errors.password = passwordError

    if (data.phone) {
      const phoneError = this.validatePhone(data.phone)
      if (phoneError) errors.phone = phoneError
    }

    return errors
  }

  validateField<K extends keyof UserFormData>(field: K, value: UserFormData[K], isEdit: boolean = false): string | undefined {
    switch (field) {
      case 'name':
        return this.validateName(value)
      case 'email':
        return this.validateEmail(value)
      case 'password':
        return this.validatePassword(value, isEdit)
      case 'phone':
        return value ? this.validatePhone(value) : undefined
      default:
        return undefined
    }
  }

  private validateName(name: string): string | undefined {
    if (!name || name.trim().length < 2) {
      return this.t('admin.users.form.errors.nameRequired')
    }
    return undefined
  }

  private validateEmail(email: string): string | undefined {
    if (!email) {
      return this.t('admin.users.form.errors.emailInvalid')
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return this.t('admin.users.form.errors.emailInvalid')
    }

    return undefined
  }

  private validatePassword(password: string | undefined, isEdit: boolean): string | undefined {
    // In edit mode, password is optional
    if (isEdit && !password) {
      return undefined
    }

    // In create mode, password is required
    if (!isEdit && !password) {
      return this.t('admin.users.form.errors.passwordLength')
    }

    // If password is provided, validate length
    if (password && password.length < 8) {
      return this.t('admin.users.form.errors.passwordLength')
    }

    return undefined
  }

  private validatePhone(phone: string): string | undefined {
    if (phone && phone.length > 20) {
      return 'Phone number is too long'
    }
    return undefined
  }
}

export const createUserValidator = (t: (key: string) => string): IUserValidator => {
  return new UserFormValidator(t)
}
