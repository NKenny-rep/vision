// app/components/Shared/SearchBar.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import SearchBar from './SearchBar.vue'

// Mock UTooltip to avoid provider context errors
const UTooltipStub = {
  name: 'UTooltip',
  template: '<div><slot /></div>'
}

// Mock useMovies composable
const { useMoviesMock } = vi.hoisted(() => ({
  useMoviesMock: vi.fn()
}))

mockNuxtImport('useMovies', () => useMoviesMock)

describe('Shared/SearchBar', () => {
  let mockSearchMovies: any

  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    
    mockSearchMovies = vi.fn().mockResolvedValue({
      data: [
        {
          imdbID: 'tt0133093',
          Title: 'The Matrix',
          Year: '1999',
          Type: 'movie',
          Poster: 'poster.jpg'
        }
      ],
      error: null,
      status: 'success'
    })

    useMoviesMock.mockReturnValue({
      searchMovies: mockSearchMovies
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should render search toggle button', async () => {
    const wrapper = await mountSuspended(SearchBar, {
      global: {
        stubs: {
          UTooltip: UTooltipStub
        }
      }
    })
    
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should toggle search state', async () => {
    const wrapper = await mountSuspended(SearchBar, {
      global: {
        stubs: {
          UTooltip: UTooltipStub
        }
      }
    })

    // Initially closed
    expect(wrapper.vm.state.isOpen).toBe(false)

    // Toggle open
    await wrapper.vm.searchHandlers.toggle()

    expect(wrapper.vm.state.isOpen).toBe(true)

    // Toggle close
    await wrapper.vm.searchHandlers.toggle()

    expect(wrapper.vm.state.isOpen).toBe(false)
  })

  it('should search when query is at least 3 characters', async () => {
    const wrapper = await mountSuspended(SearchBar, {
      global: {
        stubs: {
          UTooltip: UTooltipStub
        }
      }
    })

    wrapper.vm.state.query = 'Mat'
    wrapper.vm.searchHandlers.execute()
    
    await vi.advanceTimersByTimeAsync(400)
    await wrapper.vm.$nextTick()

    expect(mockSearchMovies).toHaveBeenCalledWith({ s: 'Mat' })
  })

  it('should not search with short query', async () => {
    const wrapper = await mountSuspended(SearchBar, {
      global: {
        stubs: {
          UTooltip: UTooltipStub
        }
      }
    })

    wrapper.vm.state.query = 'Ma'
    await wrapper.vm.searchHandlers.execute()

    expect(mockSearchMovies).not.toHaveBeenCalled()
  })

  it('should display search results', async () => {
    const wrapper = await mountSuspended(SearchBar, {
      global: {
        stubs: {
          UTooltip: UTooltipStub
        }
      }
    })

    wrapper.vm.state.query = 'Matrix'
    wrapper.vm.searchHandlers.execute()
    
    await vi.advanceTimersByTimeAsync(400)
    await wrapper.vm.$nextTick()

    expect(wrapper.vm.state.results).toHaveLength(1)
    expect(wrapper.vm.state.results[0]!.Title).toBe('The Matrix')
  })

  it('should handle search errors', async () => {
    mockSearchMovies.mockRejectedValueOnce(new Error('Search failed'))

    const wrapper = await mountSuspended(SearchBar, {
      global: {
        stubs: {
          UTooltip: UTooltipStub
        }
      }
    })

    wrapper.vm.state.query = 'Matrix'
    await wrapper.vm.searchHandlers.execute()

    // Results should be empty on error
    expect(wrapper.vm.state.results).toEqual([])
  })

  it('should clear on toggle close', async () => {
    const wrapper = await mountSuspended(SearchBar, {
      global: {
        stubs: {
          UTooltip: UTooltipStub
        }
      }
    })

    // Set state
    wrapper.vm.state.isOpen = true
    wrapper.vm.state.query = 'Matrix'
    wrapper.vm.state.results = [{ imdbID: '1', Title: 'Test', Year: '2020', Type: 'movie', Poster: '' }]

    // Toggle close
    await wrapper.vm.searchHandlers.toggle()

    expect(wrapper.vm.state.isOpen).toBe(false)
    expect(wrapper.vm.state.query).toBe('')
    expect(wrapper.vm.state.results).toEqual([])
  })

  it('should set searching state', async () => {
    // Create a promise we can control manually
    let resolveSearch: (value: any) => void
    const searchPromise = new Promise((resolve) => {
      resolveSearch = resolve
    })
    
    // Mock searchMovies to return our controlled promise
    mockSearchMovies.mockReturnValueOnce(searchPromise)
    
    const wrapper = await mountSuspended(SearchBar, {
      global: {
        stubs: {
          UTooltip: UTooltipStub
        }
      }
    })

    wrapper.vm.state.query = 'Matrix'
    
    wrapper.vm.searchHandlers.execute()
    
    // Advance timers to trigger the setTimeout callback
    await vi.advanceTimersByTimeAsync(400)
    
    // Flush promises to let the setTimeout callback start executing
    await flushPromises()
    
    // Now isSearching should be true (search started but not finished)
    expect(wrapper.vm.state.isSearching).toBe(true)
    
    // Resolve the search promise to complete the search
    resolveSearch!({
      data: [{ imdbID: 'tt0133093', Title: 'The Matrix', Year: '1999', Poster: 'url' }],
      error: null,
      status: 'success'
    })
    
    // Flush promises to let the search complete
    await flushPromises()
    
    // After completion, isSearching should be false
    expect(wrapper.vm.state.isSearching).toBe(false)
  })
})
