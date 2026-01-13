import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import AvatarPicker from './AvatarPicker.vue'

describe('Profile/AvatarPicker', () => {
  it('should render avatar picker', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test',
        userName: 'John Doe'
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should initialize with current avatar', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
        userName: 'John Doe'
      }
    })

    expect(wrapper.vm.avatarSeed).toBe('johndoe')
    expect(wrapper.vm.selectedStyle).toBe('avataaars')
  })

  it('should fallback to userName when no current avatar', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: '',
        userName: 'Jane Smith'
      }
    })

    expect(wrapper.vm.avatarSeed).toBe('Jane Smith')
  })

  it('should generate avatar URL correctly', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: '',
        userName: 'Test User'
      }
    })

    const url = wrapper.vm.generateAvatarUrl('avataaars', 'testseed')
    expect(url).toBe('https://api.dicebear.com/7.x/avataaars/svg?seed=testseed')
  })

  it('should extract avatar info from URL', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: '',
        userName: 'Test User'
      }
    })

    const url = 'https://api.dicebear.com/7.x/bottts/svg?seed=myseed'
    const info = wrapper.vm.extractAvatarInfo(url)

    expect(info).toEqual({ style: 'bottts', seed: 'myseed' })
  })

  it('should return null for invalid URL', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: '',
        userName: 'Test User'
      }
    })

    const info = wrapper.vm.extractAvatarInfo('invalid-url')
    expect(info).toBeNull()
  })

  it('should emit update:avatar when selecting new style', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: '',
        userName: 'Test User'
      }
    })

    wrapper.vm.avatarSeed = 'testseed'
    await wrapper.vm.selectAvatar('bottts')

    expect(wrapper.emitted('update:avatar')).toBeTruthy()
    expect(wrapper.emitted('update:avatar')?.[0][0]).toContain('bottts')
    expect(wrapper.emitted('update:avatar')?.[0][0]).toContain('testseed')
  })

  it('should close picker after selecting avatar', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: '',
        userName: 'Test User'
      }
    })

    wrapper.vm.showPicker = true
    await wrapper.vm.selectAvatar('avataaars')

    expect(wrapper.vm.showPicker).toBe(false)
  })

  it.skip('should randomize avatar', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: '',
        userName: 'Test User'
      }
    })

    const originalSeed = wrapper.vm.avatarSeed

    await wrapper.vm.randomizeAvatar()

    expect(wrapper.vm.avatarSeed).not.toBe(originalSeed)
    expect(wrapper.emitted('update:avatar')).toBeTruthy()
  })

  it.skip('should update selected style when randomizing', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: '',
        userName: 'Test User'
      }
    })

    wrapper.vm.selectedStyle = 'bottts'
    await wrapper.vm.randomizeAvatar()

    const emittedUrl = wrapper.emitted('update:avatar')?.[0][0] as string
    expect(emittedUrl).toContain('bottts')
  })

  it('should toggle picker visibility', async () => {
    const wrapper = await mountSuspended(AvatarPicker, {
      props: {
        currentAvatar: '',
        userName: 'Test User'
      }
    })

    expect(wrapper.vm.showPicker).toBe(false)

    wrapper.vm.showPicker = true
    expect(wrapper.vm.showPicker).toBe(true)

    wrapper.vm.showPicker = false
    expect(wrapper.vm.showPicker).toBe(false)
  })
})
