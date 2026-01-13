import type { OMDBSearchResponse, OMDBSearchParams } from '~/types'

interface FetchError {
  statusCode?: number;
  message?: string;
}

export default defineEventHandler(async (event) => {
  const { omdbApiKey } = useRuntimeConfig(event)
  const { omdbBaseUrl } = useRuntimeConfig(event).public
  
  const query = getQuery(event) as OMDBSearchParams
  
  // Validate required parameter
  if (!query.s) {
    throw createError({
      statusCode: 400,
      message: 'Search query (s) is required'
    })
  }

  // Build query parameters
  const params = new URLSearchParams({
    apikey: omdbApiKey,
    s: query.s,
    ...(query.type && { type: query.type }),
    ...(query.y && { y: query.y }),
    ...(query.page && { page: query.page.toString() }),
    r: query.r || 'json',
  })

  console.log('OMDB Search Request:', {
    url: `${omdbBaseUrl}?${params.toString()}`,
    params: {
      s: query.s,
      type: query.type,
      y: query.y,
      page: query.page
    }
  })

  try {
    const response = await $fetch<OMDBSearchResponse>(`${omdbBaseUrl}?${params.toString()}`)
    
    if (response.Response === 'False') {
      throw createError({
        statusCode: 404,
        message: response.Error || 'Movies not found'
      })
    }
    
    return response
  } catch (error: unknown) {
    const fetchError = error as FetchError;
    const statusCode = fetchError.statusCode || 500;
    const message = fetchError.message || 'Failed to fetch movies from OMDB';
    throw createError({
      statusCode,
      message
    })
  }
})
