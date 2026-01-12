// app/components/Movie/Card.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import Card from './Card.vue'

// Hoisted mocks
const { useUserSessionMock } = vi.hoisted(() => ({
  useUserSessionMock: vi.fn()
}))

const { useMovieListMock } = vi.hoisted(() => ({
  useMovieListMock: vi.fn()
}))

// Mock Nuxt composables
mockNuxtImport('useUserSession', () => useUserSessionMock)
mockNuxtImport('useMovieList', () => useMovieListMock)

describe('Movie/Card', () => {
  let mockMovieList: any

  const mockMovie = {
    Title: 'The Matrix',
    Year: '1999',
    imdbID: 'tt0133093',
    Type: 'movie',
    Poster: 'https://example.com/poster.jpg',
    Response: 'True'
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockMovieList = {
      isInList: vi.fn().mockResolvedValue(false),
      toggleInList: vi.fn().mockResolvedValue({ success: true })
    }

    useMovieListMock.mockReturnValue(mockMovieList)
  })

  it('should render movie with title and year', async () => {
    useUserSessionMock.mockReturnValue({ loggedIn: ref(false) })

    const wrapper = await mountSuspended(Card, {
      props: { movie: mockMovie }
    })

    expect(wrapper.text()).toContain('The Matrix')
    expect(wrapper.text()).toContain('1999')
  })

  it('should not check list when logged out', async () => {
    useUserSessionMock.mockReturnValue({ loggedIn: ref(false) })

    await mountSuspended(Card, {
      props: { movie: mockMovie }
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(mockMovieList.isInList).not.toHaveBeenCalled()
  })

  it('should check list when logged in', async () => {
    useUserSessionMock.mockReturnValue({ loggedIn: ref(true) })

    await mountSuspended(Card, {
      props: { movie: mockMovie }
    })

    await new Promise(resolve => setTimeout(resolve, 10))
    expect(mockMovieList.isInList).toHaveBeenCalledWith('tt0133093')
  })

  it('should show button when logged in', async () => {
    useUserSessionMock.mockReturnValue({ loggedIn: ref(true) })

    const wrapper = await mountSuspended(Card, {
      props: { movie: mockMovie }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should hide button when logged out', async () => {
    useUserSessionMock.mockReturnValue({ loggedIn: ref(false) })

    const wrapper = await mountSuspended(Card, {
      props: { movie: mockMovie }
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.find('button').exists()).toBe(false)
  })

  it('should accept size prop', async () => {
    useUserSessionMock.mockReturnValue({ loggedIn: ref(false) })

    const wrapper = await mountSuspended(Card, {
      props: {
        movie: mockMovie,
        size: 'lg'
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  it('should toggle list status', async () => {
    useUserSessionMock.mockReturnValue({ loggedIn: ref(true) })

    const wrapper = await mountSuspended(Card, {
      props: { movie: mockMovie }
    })

    await wrapper.vm.toggleList()

    expect(mockMovieList.toggleInList).toHaveBeenCalledWith('tt0133093', {
      movieTitle: 'The Matrix',
      moviePoster: 'https://example.com/poster.jpg',
      movieYear: '1999',
      movieType: 'movie'
    })
  })

  it('should set loading state on toggle', async () => {
    useUserSessionMock.mockReturnValue({ loggedIn: ref(true) })

    mockMovieList.toggleInList = vi.fn().mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ success: true }), 50))
    )

    const wrapper = await mountSuspended(Card, {
      props: { movie: mockMovie }
    })

    wrapper.vm.toggleList()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.isLoading).toBe(true)
  })
})
