# Development Guide

Complete guide for developing and extending the VideoVision platform.

## Table of Contents
- [Development Setup](#development-setup)
- [Architecture Overview](#architecture-overview)
- [Adding New Features](#adding-new-features)
- [Component Development](#component-development)
- [API Development](#api-development)
- [Database Operations](#database-operations)
- [Testing Guidelines](#testing-guidelines)
- [Internationalization](#internationalization)
- [Best Practices](#best-practices)

## Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd videoVision
npm install
```

### 2. Configure Environment

Create `.env` file:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/videovision

# Session Secret (min 32 characters)
NUXT_SESSION_PASSWORD=your-very-secure-session-password-here-min-32-chars

# OMDB API
OMDB_API_KEY=your-omdb-api-key

# Optional
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate migrations
npm run db:generate

# Apply migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed
```

### 4. Start Development

```bash
npm run dev
```

## Architecture Overview

### Application Layers

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│  (Components, Pages, Layouts)       │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│  (Composables, Utils, Middleware)   │
├─────────────────────────────────────┤
│         API Layer                   │
│  (Server API Routes)                │
├─────────────────────────────────────┤
│         Data Access Layer           │
│  (Drizzle ORM, Database)            │
└─────────────────────────────────────┘
```

### Data Flow

```
User Action → Component → Composable → API Route → Database
                ↓                          ↓
              State Update ←──────── Response
```

## Adding New Features

### Example: Add "Favorites" Feature

#### 1. Define Database Schema

```typescript
// server/database/schema.ts
export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  movieId: text('movie_id').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
```

#### 2. Create API Endpoint

```typescript
// server/api/user/favorites/add.post.ts
import { z } from 'zod'

const bodySchema = z.object({
  movieId: z.string(),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readValidatedBody(event, bodySchema.parse)

  await db.insert(favorites).values({
    userId: session.user.id,
    movieId: body.movieId,
  })

  return { success: true }
})
```

#### 3. Create Composable

```typescript
// app/composables/useFavorites.ts
export const useFavorites = () => {
  const addToFavorites = async (movieId: string) => {
    try {
      await $fetch('/api/user/favorites/add', {
        method: 'POST',
        body: { movieId }
      })
      return { success: true }
    } catch (error) {
      console.error('Failed to add favorite:', error)
      throw error
    }
  }

  const removeFromFavorites = async (movieId: string) => {
    await $fetch('/api/user/favorites/remove', {
      method: 'POST',
      body: { movieId }
    })
  }

  return {
    addToFavorites,
    removeFromFavorites,
  }
}
```

#### 4. Use in Component

```vue
<script setup lang="ts">
const { addToFavorites } = useFavorites()

const handleAddFavorite = async (movieId: string) => {
  await addToFavorites(movieId)
}
</script>

<template>
  <button @click="handleAddFavorite('tt0133093')">
    Add to Favorites
  </button>
</template>
```

#### 5. Add Tests

```typescript
// app/composables/useFavorites.test.ts
import { describe, it, expect } from 'vitest'
import { registerEndpoint } from '@nuxt/test-utils/runtime'

describe('useFavorites', () => {
  it('should add movie to favorites', async () => {
    registerEndpoint('/api/user/favorites/add', () => ({
      success: true
    }))

    const { addToFavorites } = useFavorites()
    const result = await addToFavorites('tt0133093')

    expect(result.success).toBe(true)
  })
})
```

## Component Development

### Creating New Components

Follow **Atomic Design** principles:

#### Atoms (Basic UI Elements)
```vue
<!-- app/components/UI/Badge.vue -->
<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'success' | 'danger'
  label: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})
</script>

<template>
  <span :class="`badge badge-${variant}`">
    {{ label }}
  </span>
</template>
```

#### Molecules (Component Compositions)
```vue
<!-- app/components/Movie/RatingBadge.vue -->
<script setup lang="ts">
import type { Movie } from '~/types'

interface Props {
  movie: Movie
}

const props = defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-2">
    <UIStarRating :model-value="movie.rating" readonly />
    <UIBadge :label="`${movie.reviewCount} reviews`" />
  </div>
</template>
```

### Component Testing Pattern

```typescript
// app/components/UI/Badge.test.ts
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Badge from './Badge.vue'

describe('UI/Badge', () => {
  it('should render with label', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: { label: 'New' }
    })

    expect(wrapper.text()).toContain('New')
  })

  it('should apply variant class', async () => {
    const wrapper = await mountSuspended(Badge, {
      props: { label: 'Success', variant: 'success' }
    })

    expect(wrapper.html()).toContain('badge-success')
  })
})
```

## API Development

### Creating API Endpoints

#### GET Request
```typescript
// server/api/movies/trending.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = 20

  const movies = await db
    .select()
    .from(moviesTable)
    .orderBy(desc(moviesTable.popularity))
    .limit(limit)
    .offset((page - 1) * limit)

  return {
    movies,
    page,
    totalPages: Math.ceil(100 / limit) // Calculate from count
  }
})
```

#### POST Request with Validation
```typescript
// server/api/reviews/create.post.ts
import { z } from 'zod'

const reviewSchema = z.object({
  movieId: z.string().min(1),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
})

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  const body = await readValidatedBody(event, reviewSchema.parse)

  const review = await db.insert(reviews).values({
    userId: session.user.id,
    contentId: body.movieId,
    rating: body.rating,
    comment: body.comment,
  }).returning()

  return review[0]
})
```

#### Protected Endpoint
```typescript
// server/api/admin/users/list.get.ts
export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event)
  
  // Check admin role
  if (session.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Admin access required'
    })
  }

  const users = await db.select().from(usersTable)
  return users
})
```

## Database Operations

### Schema Definition
```typescript
// server/database/schema.ts
import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: integer('author_id').references(() => users.id),
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})
```

### Migrations
```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback
```

### Queries
```typescript
// Complex query example
const userWithMovies = await db
  .select({
    user: users,
    movieCount: count(movieList.id),
  })
  .from(users)
  .leftJoin(movieList, eq(users.id, movieList.userId))
  .where(eq(users.id, userId))
  .groupBy(users.id)
```

## Testing Guidelines

### Composable Testing
```typescript
import { registerEndpoint, mockNuxtImport } from '@nuxt/test-utils/runtime'

// Mock auto-imports
const { navigateToMock } = vi.hoisted(() => ({
  navigateToMock: vi.fn()
}))
mockNuxtImport('navigateTo', () => navigateToMock)

// Mock API endpoints
registerEndpoint('/api/movies/search', () => ({
  results: [{ id: '1', title: 'Test Movie' }]
}))
```

### Component Testing
```typescript
import { mountSuspended } from '@nuxt/test-utils/runtime'

// Test with mocked composables
const { useAuthMock } = vi.hoisted(() => ({
  useAuthMock: vi.fn()
}))
mockNuxtImport('useAuthentication', () => useAuthMock)

useAuthMock.mockReturnValue({
  user: ref({ id: 1, email: 'test@test.com' }),
  logout: vi.fn()
})

const wrapper = await mountSuspended(MyComponent)
```

### Best Practices
- ✅ Test behavior, not implementation
- ✅ Mock external dependencies
- ✅ Use meaningful test descriptions
- ✅ Keep tests isolated and independent
- ✅ Test edge cases and error states

## Internationalization

### Adding New Translations

#### 1. Update Translation Files
```json
// i18n/locales/en.json
{
  "features": {
    "newFeature": "My New Feature",
    "description": "Feature description"
  }
}
```

```json
// i18n/locales/es.json
{
  "features": {
    "newFeature": "Mi Nueva Característica",
    "description": "Descripción de la característica"
  }
}
```

#### 2. Use in Components
```vue
<template>
  <div>
    <h1>{{ $t('features.newFeature') }}</h1>
    <p>{{ $t('features.description') }}</p>
  </div>
</template>
```

#### 3. Use in Composables
```typescript
const { t } = useI18n()
const message = t('features.newFeature')
```

### Adding New Language

1. Create locale file: `i18n/locales/fr.json`
2. Update `i18n.config.ts`:

```typescript
export default defineI18nConfig(() => ({
  locales: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' }, // New
  ],
  defaultLocale: 'en'
}))
```

## Best Practices

### Code Organization
- ✅ One component per file
- ✅ Co-locate tests with components
- ✅ Group related utilities
- ✅ Keep composables focused and reusable

### Performance
- ✅ Use `lazy` imports for heavy components
- ✅ Implement virtual scrolling for large lists
- ✅ Optimize images with `NuxtImg`
- ✅ Use `useFetch` with proper cache strategies

### Security
- ✅ Validate all user inputs (Zod schemas)
- ✅ Use `requireUserSession` for protected routes
- ✅ Sanitize user-generated content
- ✅ Implement CSRF protection
- ✅ Use secure session configuration

### Error Handling
```typescript
// In composables
try {
  const data = await $fetch('/api/endpoint')
  return data
} catch (error) {
  console.error('Operation failed:', error)
  // Show user-friendly message
  throw new Error('Failed to complete operation')
}

// In API routes
export default defineEventHandler(async (event) => {
  try {
    // ... operation
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})
```

### TypeScript
- ✅ Define interfaces for all data structures
- ✅ Use strict type checking
- ✅ Avoid `any` types
- ✅ Share types between client and server
- ✅ Use Zod for runtime validation

## Common Tasks

### Add New Page
```typescript
// app/pages/about.vue
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: ['auth'] // Optional
})
</script>

<template>
  <div>
    <h1>About Page</h1>
  </div>
</template>
```

### Add New Middleware
```typescript
// app/middleware/premium.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  const { user } = useUserSession()
  
  if (!user.value?.isPremium) {
    return navigateTo('/subscribe')
  }
})
```

### Add Global State
```typescript
// app/composables/useGlobalState.ts
export const useGlobalState = () => {
  const notifications = useState<Notification[]>('notifications', () => [])
  
  const addNotification = (notification: Notification) => {
    notifications.value.push(notification)
  }
  
  return {
    notifications,
    addNotification
  }
}
```

## Debugging

### Enable Debugging
```bash
# Debug server
DEBUG=nuxt:* npm run dev

# Debug specific module
DEBUG=nuxt:auth npm run dev
```

### Vue DevTools
Install Vue DevTools browser extension for component inspection and state debugging.

### Database Debugging
```typescript
// Enable query logging
import { drizzle } from 'drizzle-orm/postgres-js'

const db = drizzle(client, { 
  schema,
  logger: true // Enable SQL query logging
})
```

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Setup
Set production environment variables:
- `DATABASE_URL`
- `NUXT_SESSION_PASSWORD`
- `OMDB_API_KEY`
- `NODE_ENV=production`

### Deploy Options
- **Vercel**: Zero-config deployment
- **Netlify**: Nuxt preset available
- **Docker**: Use provided Dockerfile
- **Node.js**: Run `.output/server/index.mjs`

## Resources

- [Nuxt 3 Documentation](https://nuxt.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Vitest](https://vitest.dev)
- [Nuxt UI](https://ui.nuxt.com)
- [Vue 3](https://vuejs.org)

## Getting Help

- Check existing documentation in `/docs`
- Review test files for usage examples
- Check component implementations
- Open an issue for bugs or feature requests
