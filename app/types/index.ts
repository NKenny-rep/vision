/**
 * Type Definitions
 * Global TypeScript interfaces and types for the application
 */

// ==========================================
// USER TYPES
// ==========================================

export interface User {
  id: number
  email: string
  userName?: string
  fullName?: string
  avatar?: string
  roles: UserRole[]
  subscription?: SubscriptionPlan
  createdAt: Date | string
  updatedAt?: Date | string
}

export type UserRole = 'admin' | 'user' | 'moderator'

export interface UserSession {
  user: {
    id: number
    email: string
    roles: UserRole[]
  }
  loggedInAt: Date | string
  expiresAt?: Date | string
}

export interface SubscriptionPlan {
  id: string
  name: 'Basic' | 'Standard' | 'Premium'
  price: number
  quality: VideoQuality
  screens: number
  active: boolean
  renewsAt?: Date | string
}

// ==========================================
// MOVIE/VIDEO TYPES (OMDB API)
// ==========================================

export interface OMDBMovie {
  Title: string
  Year: string
  Rated: string
  Released: string
  Runtime: string
  Genre: string
  Director: string
  Writer: string
  Actors: string
  Plot: string
  Language: string
  Country: string
  Awards: string
  Poster: string
  Ratings: OMDBRating[]
  Metascore: string
  imdbRating: string
  imdbVotes: string
  imdbID: string
  Type: 'movie' | 'series' | 'episode'
  DVD?: string
  BoxOffice?: string
  Production?: string
  Website?: string
  Response: 'True' | 'False'
  Error?: string
  totalSeasons?: string
}

export interface OMDBRating {
  Source: string
  Value: string
}

export interface OMDBSearchResult {
  Search: OMDBSearchItem[]
  totalResults: string
  Response: 'True' | 'False'
  Error?: string
}

export interface OMDBSearchItem {
  Title: string
  Year: string
  imdbID: string
  Type: 'movie' | 'series' | 'episode'
  Poster: string
}

// Alias for OMDBSearchResult
export type OMDBSearchResponse = OMDBSearchResult

// OMDB API Query Parameters
export interface OMDBMovieParams {
  i?: string // IMDb ID
  t?: string // Movie title
  type?: 'movie' | 'series' | 'episode'
  y?: string // Year
  plot?: 'short' | 'full'
  r?: 'json' | 'xml'
  callback?: string
  v?: string
}

export interface OMDBSearchParams {
  s: string // Search query (required)
  type?: 'movie' | 'series' | 'episode'
  y?: string // Year
  r?: 'json' | 'xml'
  page?: number // 1-100
  callback?: string
  v?: string
}

// ==========================================
// INTERNAL VIDEO/MOVIE TYPES
// ==========================================

export interface Movie {
  id: string
  imdbId?: string
  title: string
  year: number
  rated?: string
  releaseDate?: Date | string
  runtime?: number // in minutes
  genres: string[]
  director?: string
  writers?: string[]
  actors: string[]
  plot: string
  language: string
  country: string
  awards?: string
  poster?: string
  thumbnail?: string
  videoUrl?: string
  trailerUrl?: string
  ratings: Rating[]
  averageRating: number
  totalReviews: number
  type: ContentType
  status: ContentStatus
  views: number
  likes: number
  dislikes: number
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface Rating {
  source: string
  value: string | number
  maxValue?: number
}

export type ContentType = 'movie' | 'series' | 'episode' | 'documentary'
export type ContentStatus = 'draft' | 'published' | 'archived' | 'pending'
export type VideoQuality = '480p' | '720p' | '1080p' | '4K'

export interface Series extends Movie {
  totalSeasons: number
  seasons: Season[]
}

export interface Season {
  seasonNumber: number
  episodes: Episode[]
  releaseYear: number
}

export interface Episode {
  id: string
  episodeNumber: number
  seasonNumber: number
  title: string
  plot: string
  runtime: number
  releaseDate: Date | string
  videoUrl?: string
  thumbnail?: string
}

// ==========================================
// REVIEW/COMMENT TYPES
// ==========================================

export interface Review {
  id: string | number
  userId: string
  userName: string
  userAvatar?: string
  contentId: string // Movie/Video ID
  contentType: ContentType
  rating: number
  comment: string
  likes: number
  dislikes: number
  isLiked?: boolean
  isDisliked?: boolean
  replies?: ReviewReply[]
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface ReviewReply {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  comment: string
  createdAt: Date | string
}

export interface CreateReviewDTO {
  contentId: string
  rating: number
  comment: string
}

export interface UpdateReviewDTO {
  rating?: number
  comment?: string
}

// ==========================================
// LIST/COLLECTION TYPES
// ==========================================

export interface UserList {
  id: string
  userId: string
  name: string
  description?: string
  items: UserListItem[]
  isPublic: boolean
  createdAt: Date | string
  updatedAt?: Date | string
}

export interface UserListItem {
  id: string
  contentId: string
  contentType: ContentType
  addedAt: Date | string
}

// ==========================================
// SEARCH/FILTER TYPES
// ==========================================

export interface SearchParams {
  query: string
  type?: ContentType
  genre?: string
  year?: number
  rating?: number
  page?: number
  limit?: number
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export interface FilterOptions {
  genres?: string[]
  years?: number[]
  ratings?: number[]
  contentTypes?: ContentType[]
}

// ==========================================
// AUTHENTICATION TYPES
// ==========================================

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface RegisterData {
  email: string
  password: string
  confirmPassword: string
  fullName?: string
  termsAccepted: boolean
}

export interface AuthResponse {
  success: boolean
  user?: User
  session?: UserSession
  message?: string
  error?: string
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ==========================================
// FORM TYPES
// ==========================================

export interface FormField {
  name: string
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio'
  label: string
  placeholder?: string
  required?: boolean
  defaultValue?: any
  options?: FormFieldOption[]
  validation?: FormFieldValidation
}

export interface FormFieldOption {
  label: string
  value: string | number
}

export interface FormFieldValidation {
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  min?: number
  max?: number
  custom?: (value: any) => boolean | string
}

// ==========================================
// ANALYTICS TYPES
// ==========================================

export interface VideoAnalytics {
  videoId: string
  views: number
  uniqueViews: number
  averageWatchTime: number // in seconds
  completionRate: number // percentage
  likes: number
  dislikes: number
  shares: number
  comments: number
  period: 'day' | 'week' | 'month' | 'year' | 'all'
}

export interface UserActivity {
  userId: string
  action: 'view' | 'like' | 'dislike' | 'comment' | 'share' | 'add_to_list'
  contentId: string
  contentType: ContentType
  timestamp: Date | string
  metadata?: Record<string, any>
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export interface Notification {
  id: string
  userId: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  read: boolean
  actionUrl?: string
  createdAt: Date | string
}

// ==========================================
// ADMIN TYPES
// ==========================================

export interface AdminStats {
  totalUsers: number
  totalVideos: number
  totalReviews: number
  totalViews: number
  activeSubscriptions: number
  revenue: number
  period: 'today' | 'week' | 'month' | 'year'
}

export interface ContentModeration {
  id: string
  contentType: 'video' | 'review' | 'comment'
  contentId: string
  reportedBy: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: Date | string
  createdAt: Date | string
}

// ==========================================
// UTILITY TYPES
// ==========================================

export type Nullable<T> = T | null
export type Optional<T> = T | undefined
export type ID = string | number

export type SortOrder = 'asc' | 'desc'
export type SortBy = 'date' | 'rating' | 'views' | 'title' | 'relevance'

export interface SortOptions {
  sortBy: SortBy
  order: SortOrder
}

export interface DateRange {
  from: Date | string
  to: Date | string
}

// ==========================================
// COMPONENT PROP TYPES
// ==========================================

export interface StarRatingProps {
  modelValue?: number
  maxStars?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  readonly?: boolean
  showLabel?: boolean
  color?: string
}

export interface VideoCardProps {
  movie: Movie
  showRating?: boolean
  showGenres?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export interface ReviewCardProps {
  review: Review
  showActions?: boolean
  readonly?: boolean
}
