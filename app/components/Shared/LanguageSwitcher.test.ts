import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import LanguageSwitcher from './LanguageSwitcher.vue'

// Mock i18n
const { useI18nMock } = vi.hoisted(() => ({
  useI18nMock: vi.fn()
}))

mockNuxtImport('useI18n', () => useI18nMock)

describe('Shared/LanguageSwitcher', () => {
  const mockLocales = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    useI18nMock.mockReturnValue({
      locale: ref('en'),
      locales: ref(mockLocales),
      setLocale: vi.fn()
    })
  })

  it('should render language switcher', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher)

    expect(wrapper.exists()).toBe(true)
  })

  it('should display current language', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher)

    expect(wrapper.vm.currentLanguage?.name).toBe('English')
  })

  it('should create menu items for all locales', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher)

    expect(wrapper.vm.languageItems).toHaveLength(2)
    expect(wrapper.vm.languageItems[0].label).toBe('English')
    expect(wrapper.vm.languageItems[1].label).toBe('Español')
  })

  it('should highlight current language in menu', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher)

    const currentItem = wrapper.vm.languageItems.find(item => item.label === 'English')
    expect(currentItem?.class).toContain('text-primary')
  })

  it('should call setLocale when language is selected', async () => {
    const mockSetLocale = vi.fn()
    useI18nMock.mockReturnValue({
      locale: ref('en'),
      locales: ref(mockLocales),
      setLocale: mockSetLocale
    })

    const wrapper = await mountSuspended(LanguageSwitcher)

    const spanishItem = wrapper.vm.languageItems.find(item => item.label === 'Español')
    spanishItem?.onSelect()

    expect(mockSetLocale).toHaveBeenCalledWith('es')
  })

  it('should show correct flag icon for English', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher)

    const enItem = wrapper.vm.languageItems.find(item => item.label === 'English')
    expect(enItem?.icon).toBe('i-circle-flags-us')
  })

  it('should show correct flag icon for Spanish', async () => {
    const wrapper = await mountSuspended(LanguageSwitcher)

    const esItem = wrapper.vm.languageItems.find(item => item.label === 'Español')
    expect(esItem?.icon).toBe('i-circle-flags-ar')
  })

  it('should use fallback icon for unknown language', async () => {
    useI18nMock.mockReturnValue({
      locale: ref('fr'),
      locales: ref([{ code: 'fr', name: 'Français' }]),
      setLocale: vi.fn()
    })

    const wrapper = await mountSuspended(LanguageSwitcher)

    const frItem = wrapper.vm.languageItems[0]
    expect(frItem.icon).toBe('i-heroicons-language')
  })
})
