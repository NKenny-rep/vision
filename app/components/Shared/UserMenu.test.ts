import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import UserMenu from './UserMenu.vue'

// Mock composables
const { useI18nMock } = vi.hoisted(() => ({
  useI18nMock: vi.fn()
}))

const { useLocalePathMock } = vi.hoisted(() => ({
  useLocalePathMock: vi.fn()
}))

const { useAuthenticationMock } = vi.hoisted(() => ({
  useAuthenticationMock: vi.fn()
}))

mockNuxtImport('useI18n', () => useI18nMock)
mockNuxtImport('useLocalePath', () => useLocalePathMock)
mockNuxtImport('useAuthentication', () => useAuthenticationMock)

describe('Shared/UserMenu', () => {
  let mockLogout: any

  beforeEach(() => {
    vi.clearAllMocks()

    mockLogout = vi.fn()

    useI18nMock.mockReturnValue({
      t: (key: string) => key
    })

    useLocalePathMock.mockReturnValue((path: string) => path)

    useAuthenticationMock.mockReturnValue({
      user: ref({ email: 'test@example.com', id: 1 }),
      logout: mockLogout
    })
  })

  it('should render user menu', async () => {
    const wrapper = await mountSuspended(UserMenu)

    expect(wrapper.exists()).toBe(true)
  })

  it('should display user email in menu', async () => {
    const wrapper = await mountSuspended(UserMenu)

    expect(wrapper.vm.userMenuItems[0].label).toBe('test@example.com')
  })

  it('should create menu items for profile', async () => {
    const wrapper = await mountSuspended(UserMenu)

    const profileItem = wrapper.vm.userMenuItems.find(item => item.to === '/profile')
    expect(profileItem).toBeDefined()
    expect(profileItem?.label).toBe('nav.profile')
  })

  it('should create menu item for my list', async () => {
    const wrapper = await mountSuspended(UserMenu)

    const myListItem = wrapper.vm.userMenuItems.find(item => item.to === '/movie-list')
    expect(myListItem).toBeDefined()
    expect(myListItem?.label).toBe('nav.myList')
  })

  it('should create logout menu item', async () => {
    const wrapper = await mountSuspended(UserMenu)

    const logoutItem = wrapper.vm.userMenuItems.find(item => item.onClick)
    expect(logoutItem).toBeDefined()
  })

  it('should call logout on logout menu item click', async () => {
    const wrapper = await mountSuspended(UserMenu)

    await wrapper.vm.handleLogout()

    expect(mockLogout).toHaveBeenCalled()
  })

  it('should disable user email item', async () => {
    const wrapper = await mountSuspended(UserMenu)

    expect(wrapper.vm.userMenuItems[0].disabled).toBe(true)
  })

  it('should show avatar', async () => {
    const wrapper = await mountSuspended(UserMenu)

    const avatar = wrapper.findComponent({ name: 'UAvatar' })
    expect(avatar.exists()).toBe(true)
  })

  it('should use fallback when no user email', async () => {
    useAuthenticationMock.mockReturnValue({
      user: ref(null),
      logout: mockLogout
    })

    const wrapper = await mountSuspended(UserMenu)

    expect(wrapper.vm.userMenuItems[0].label).toBe('nav.profile')
  })
})
