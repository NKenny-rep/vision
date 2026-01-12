# VideoVision 🎬

A modern video streaming platform built with Nuxt 4, featuring multi-language support, subscription management, and a comprehensive movie library.

## Quick Start

### Prerequisites
- Node.js 20+ 
- PostgreSQL database

Note: for testing purposes there is already a neon postgre database connection working out of the box same as omdb
### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Configure DATABASE_URL and other variables

# Run database migrations
npm run db:migrate

# Seed database (optional)
npm run db:seed

# Start development server
npm run dev

```

Visit `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with sample data
```

## Tech Stack

- **Framework**: Nuxt 3 (SSR/SSG)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: nuxt-auth-utils
- **Testing**: Vitest + @nuxt/test-utils
- **Internationalization**: @nuxtjs/i18n
- **Styling**: Tailwind CSS (implied from project structure)

## Design Patterns & Architecture

### 1. **Atomic Design Pattern**
Components are organized hierarchically:
- **Atoms**: Basic UI elements (`Button`, `StarRating`, `Skeleton`)
- **Molecules**: Simple component combinations (`SearchBar`, `PricingCard`)
- **Organisms**: Complex components (`Navbar`, `GenreSection`, `SubscriptionManager`)
- **Templates**: Layouts (`default.vue`, `dashboard-layout.vue`)
- **Pages**: Route-specific views

### 2. **Composables Pattern**
Reusable business logic extracted into composables:
- `useAuthentication` - Auth state and operations
- `useMovies` - Movie data fetching and management
- `useProfile` - User profile operations
- `useReviews` - Review CRUD operations
- Located in `app/composables/`

### 3. **Repository Pattern**
Data access abstraction layer:
- Database operations centralized in `server/database/`
- Schema definitions in `server/database/schema.ts`
- Queries separated from business logic

### 4. **Layout Strategy Pattern**
Different layouts for different user contexts:
- `default.vue` - Public pages
- `loginLayout.vue` - Authentication pages
- `dashboard-layout.vue` - Admin/dashboard pages

### 5. **Middleware Pattern**
Route protection and navigation guards:
- `auth.ts` - Protect authenticated routes
- `not-auth.ts` - Redirect logged-in users
- `admin.ts` - Admin-only route protection

### 6. **API Layer Architecture**
RESTful API organized by resource:
- `/server/api/auth/` - Authentication endpoints
- `/server/api/movies/` - Movie operations
- `/server/api/plans/` - Subscription plans
- `/server/api/user/` - User profile management

## Core Principles

✅ **Separation of Concerns** - Clear boundaries between UI, business logic, and data access  
✅ **Type Safety** - Full TypeScript coverage for maintainability  
✅ **Testability** - 178 tests covering composables and components  
✅ **Internationalization** - Multi-language support (EN/ES)  
✅ **Responsive Design** - Mobile-first approach  
✅ **Code Reusability** - DRY principle with composables and utilities

## Project Structure

```
app/
├── components/      # Atomic Design components
│   ├── UI/         # Atoms (Button, StarRating, Pagination)
│   ├── Shared/     # Molecules (SearchBar, LanguageSwitcher)
│   ├── Movie/      # Domain-specific organisms
│   └── ...
├── composables/    # Reusable business logic
├── layouts/        # Layout templates
├── pages/          # File-based routing
├── middleware/     # Route guards
└── utils/          # Helper functions

server/
├── api/            # API endpoints
├── database/       # Database schema & operations
└── types/          # Server-side types

i18n/
└── locales/        # Translation files (en.json, es.json)
```

## Key Features

- 🎬 Movie browsing with advanced filtering
- ⭐ User reviews and ratings
- 👤 User authentication and profiles
- 💳 Subscription management
- 🌍 Multi-language support (i18n)
- 📱 Responsive design
- 🔒 Role-based access control
- 📊 Admin dashboard
- 🎨 Customizable user avatars

## Environment Variables

Create a `.env` file with:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/videovision
NUXT_SESSION_PASSWORD=your-secret-session-password
# Add other required variables
```

## Testing

Run the comprehensive test suite:

```bash
npm test              # Run all 178 tests
npm run test:watch    # Watch mode for development
```

Tests include:
- 57 composable tests
- 121 component tests
- Full coverage of business logic and UI interactions

## Docker Deployment

```bash
# Build image
docker build -t videovision-app .

# Run container
docker run -p 3000:3000 videovision-app
```

## Documentation

- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Comprehensive guide for extending the project
- [I18N_GUIDE.md](./docs/I18N_GUIDE.md) - Internationalization implementation
- [DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) - Database configuration

