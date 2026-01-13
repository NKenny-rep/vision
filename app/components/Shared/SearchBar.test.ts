// app/components/Shared/SearchBar.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import SearchBar from './SearchBar.vue'

// Mock useMovies composable
const { useMoviesMock } = vi.hoisted(() => ({
  useMoviesMock: vi.fn()
}))

mockNuxtImport('useMovies', () => useMoviesMock)

describe('Shared/SearchBar', () => {
  let mockSearchMovies: any

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockSearchMovies = vi.fn().mockResolvedValue({
      data: {
        value: {
          Search: [
            {
              imdbID: 'tt0133093',
              Title: 'The Matrix',
              Year: '1999',
              Type: 'movie',
              Poster: 'poster.jpg'
            }
          ]
        }
      }
    })

    useMoviesMock.mockReturnValue({
      searchMovies: mockSearchMovies
    })
  })

  it('should render search toggle button', async () => {
    const wrapper = await mountSuspended(SearchBar)
    
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should toggle search state', async () => {
    const wrapper = await mountSuspended(SearchBar)

    // Initially closed
    expect(wrapper.vm.isOpen).toBe(false)

    // Toggle open
    await wrapper.vm.toggleSearch()

    expect(wrapper.vm.isOpen).toBe(true)

    // Toggle close
    await wrapper.vm.toggleSearch()

    expect(wrapper.vm.isOpen).toBe(false)
  })

  it('should search when query is at least 3 characters', async () => {
    const wrapper = await mountSuspended(SearchBar)

    wrapper.vm.query = 'Mat'
    await wrapper.vm.handleSearch()

    expect(mockSearchMovies).toHaveBeenCalledWith({ s: 'Mat' })
  })

  it('should not search with short query', async () => {
    const wrapper = await mountSuspended(SearchBar)

    wrapper.vm.query = 'Ma'
    await wrapper.vm.handleSearch()

    expect(mockSearchMovies).not.toHaveBeenCalled()
  })

  it('should display search results', async () => {
    const wrapper = await mountSuspended(SearchBar)

    wrapper.vm.query = 'Matrix'
    await wrapper.vm.handleSearch()
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.results).toHaveLength(1)
    expect(wrapper.vm.results[0].Title).toBe('The Matrix')
  })

  it('should handle search errors', async () => {
    mockSearchMovies.mockRejectedValueOnce(new Error('Search failed'))

    const wrapper = await mountSuspended(SearchBar)

    wrapper.vm.query = 'Matrix'
    await wrapper.vm.handleSearch()

    // Results should be empty on error
    expect(wrapper.vm.results).toEqual([])
  })

  it('should clear on toggle close', async () => {
    const wrapper = await mountSuspended(SearchBar)

    // Set state
    wrapper.vm.isOpen = true
    wrapper.vm.query = 'Matrix'
    wrapper.vm.results = [{ imdbID: '1', Title: 'Test', Year: '2020', Type: 'movie', Poster: '' }]

    // Toggle close
    await wrapper.vm.toggleSearch()

    expect(wrapper.vm.isOpen).toBe(false)
    expect(wrapper.vm.query).toBe('')
    expect(wrapper.vm.results).toEqual([])
  })

  it('should set searching state', async () => {
    const wrapper = await mountSuspended(SearchBar)

    wrapper.vm.query = 'Matrix'
    
    const promise = wrapper.vm.handleSearch()
    expect(wrapper.vm.isSearching).toBe(true)

    await promise
    expect(wrapper.vm.isSearching).toBe(false)
  })
})
