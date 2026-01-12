import type { OMDBMovie, OMDBMovieParams } from '~/types'

export default defineEventHandler(async (event) => {
  const { omdbApiKey } = useRuntimeConfig(event)
  const { omdbBaseUrl } = useRuntimeConfig(event).public
  
  // Get the encoded ID from the route and decode it
  const encodedId = getRouterParam(event, 'id')
  const id = encodedId ? decodeURIComponent(encodedId) : null
  
  const query = getQuery(event) as Omit<OMDBMovieParams, 'i' | 't'>
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Movie ID or title is required'
    })
  }

  // Determine if ID is an IMDb ID (starts with 'tt') or a title
  const isImdbId = id.startsWith('tt')
  
  // Build query parameters - URLSearchParams handles encoding automatically
  const params = new URLSearchParams({
    apikey: omdbApiKey,
    ...(isImdbId ? { i: id } : { t: id }),
    ...(query.type && { type: query.type }),
    ...(query.y && { y: query.y }),
    plot: query.plot || 'short',
    r: query.r || 'json',
  })

  try {
    const response = await $fetch<OMDBMovie>(`${omdbBaseUrl}?${params.toString()}`)
    
    if (response.Response === 'False') {
      throw createError({
        statusCode: 404,
        message: response.Error || 'Movie not found!'
      })
    }
    
    return response
  } catch (error: any) {
    console.error('OMDB API Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch movie from OMDB'
    })
  }
})
