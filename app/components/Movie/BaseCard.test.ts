import { describe, it, expect, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import BaseCard from './BaseCard.vue'

// Mock useLocalePath
const { useLocalePathMock } = vi.hoisted(() => ({
  useLocalePathMock: vi.fn()
}))

mockNuxtImport('useLocalePath', () => useLocalePathMock)

describe('Movie/BaseCard', () => {
  const mockMovie = {
    id: 'tt0133093',
    title: 'The Matrix',
    poster: 'https://example.com/poster.jpg',
    year: '1999',
    type: 'movie'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    useLocalePathMock.mockReturnValue((path: string) => path)
  })

  it('should render movie card', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should display movie title on hover', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie
      }
    })

    expect(wrapper.text()).toContain('The Matrix')
  })

  it('should display movie year', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie
      }
    })

    expect(wrapper.text()).toContain('1999')
  })

  it('should display movie type', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie
      }
    })

    expect(wrapper.text()).toContain('movie')
  })

  it('should link to watch page', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie
      }
    })

    const link = wrapper.findComponent({ name: 'NuxtLink' })
    expect(link.exists()).toBe(true)
    expect(link.props('to')).toContain('tt0133093')
  })

  it('should apply small size class', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie,
        size: 'sm'
      }
    })

    expect(wrapper.html()).toContain('h-48')
  })

  it('should apply medium size class by default', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie
      }
    })

    expect(wrapper.html()).toContain('h-60')
  })

  it('should apply large size class', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie,
        size: 'lg'
      }
    })

    expect(wrapper.html()).toContain('h-72')
  })

  it('should render action button slot if provided', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie
      },
      slots: {
        'action-button': '<button>Add to List</button>'
      }
    })

    expect(wrapper.html()).toContain('Add to List')
  })

  it('should show play icon on hover overlay', async () => {
    const wrapper = await mountSuspended(BaseCard, {
      props: {
        movie: mockMovie
      }
    })

    // Icon is rendered with UIcon which uses iconify
    expect(wrapper.html()).toContain('i-heroicons:play-solid')
  })
})
