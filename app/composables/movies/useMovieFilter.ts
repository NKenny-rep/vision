
import type { OMDBMovie } from '~/types'
import moviesData from '~/data/movies.json'
import { BROWSE } from '~/constants'

export type FilterType = 'all' | 'movie' | 'series'

interface FilterConfig {
  excludeTitles?: string[]
}

export const useMovieFilter = (config: FilterConfig = {}) => {
  const activeFilter = ref<FilterType>('all')
  
  // Available pools
  const allMovieTitles = moviesData.movies as string[]
  const allSeriesTitles = moviesData.series as string[]
  
  const excludedTitles = new Set([
    ...BROWSE.FEATURED_MOVIES,
    ...(config.excludeTitles || [])
  ])
  
  const availableMovies = ref<string[]>(
    allMovieTitles.filter(title => !excludedTitles.has(title))
  )
  const availableSeries = ref<string[]>(
    allSeriesTitles.filter(title => !excludedTitles.has(title))
  )
  
  // Indices for pagination
  const movieIndex = ref(0)
  const seriesIndex = ref(0)
  
  /**
   * Get movies to load based on active filter
   */
  const getMoviesToLoad = (itemsPerPage: number) => {
    let moviesToLoad: string[] = []
    let hasMoreItems = true
    
    switch (activeFilter.value) {
      case 'all': {
        const moviesNeeded = Math.ceil(itemsPerPage / 2)
        const seriesNeeded = Math.floor(itemsPerPage / 2)
        
        const movieBatch = availableMovies.value.slice(
          movieIndex.value, 
          movieIndex.value + moviesNeeded
        )
        const seriesBatch = availableSeries.value.slice(
          seriesIndex.value, 
          seriesIndex.value + seriesNeeded
        )
        
        moviesToLoad = [...movieBatch, ...seriesBatch]
        movieIndex.value += moviesNeeded
        seriesIndex.value += seriesNeeded
        
        hasMoreItems = !(
          movieIndex.value >= availableMovies.value.length && 
          seriesIndex.value >= availableSeries.value.length
        )
        break
      }
      case 'movie': {
        moviesToLoad = availableMovies.value.slice(
          movieIndex.value, 
          movieIndex.value + itemsPerPage
        )
        movieIndex.value += itemsPerPage
        hasMoreItems = movieIndex.value < availableMovies.value.length
        break
      }
      case 'series': {
        moviesToLoad = availableSeries.value.slice(
          seriesIndex.value, 
          seriesIndex.value + itemsPerPage
        )
        seriesIndex.value += itemsPerPage
        hasMoreItems = seriesIndex.value < availableSeries.value.length
        break
      }
    }
    
    return { moviesToLoad, hasMoreItems }
  }
  
  /**
   * Filter movies by type
   */
  const filterMovies = (movies: OMDBMovie[]) => {
    if (activeFilter.value === 'all') return movies
    return movies.filter(m => m.Type === activeFilter.value)
  }
  
  /**
   * Reset filter state
   */
  const resetFilter = () => {
    movieIndex.value = 0
    seriesIndex.value = 0
  }
  
  return {
    activeFilter,
    getMoviesToLoad,
    filterMovies,
    resetFilter
  }
}
