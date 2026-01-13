# VideoVision 🎬

A modern video streaming platform built with Nuxt 4, featuring multi-language support, subscription management, and a comprehensive movie library.

## Quick Start

### Prerequisites
For non-containerized deployment:
- Node.js 20+ 
- PostgreSQL database
OR
- Docker
(a dockerized project with database setup is provided)

Note: for testing purposes there is already a neon postgre database connection working out of the box same as omdb
### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Configure DATABASE_URL and other variables

```

if u want to use your own database these are the steps:


```bash
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

- **Framework**: Nuxt 4 (SSR/SSG)
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

### Using Docker Compose (Recommended - Includes PostgreSQL)

```bash
# Start both app and database
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down

# Stop and remove volumes (warning: deletes database data)
docker-compose down -v
```

The app will be available at `http://localhost:3000` with its own isolated PostgreSQL database.

### Using Docker Only (Manual)

```bash
# Build image
docker build -t videovision-app .

# Run container (requires external database)
docker run -p 3000:3000 \
  -e DATABASE_URL=your_database_url \
  -e NUXT_SESSION_PASSWORD=your_secret \
  videovision-app
```

## Documentation

- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Comprehensive guide for extending the project
- [I18N_GUIDE.md](./docs/I18N_GUIDE.md) - Internationalization implementation
- [DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) - Database configuration

---

## Getting Started with Docker

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Git (to clone the repository)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd videoVision
   ```

2. **Start Docker Desktop**
   - Ensure Docker Desktop is running (check system tray for Docker icon)
   - Wait until Docker is fully started (icon stops animating)

3. **Build and start containers**
   ```bash
   docker-compose up --build -d
   ```
   
   This will:
   - Build the Nuxt application
   - Pull PostgreSQL 16 image
   - Create and start both containers
   - Automatically create database schema
   - Seed the database with sample data

4. **Verify containers are running**
   ```bash
   docker-compose ps
   ```
   
   You should see:
   - `videovision-app` - Running on port 3000
   - `videovision-db` - Running on port 5432

5. **View application logs**
   ```bash
   docker-compose logs -f app
   ```
   
   Look for: `Listening on http://0.0.0.0:3000`

6. **Access the application**
   - Open browser: `http://localhost:3000`
   - Login with default credentials:
     - **Admin**: `admin@videovision.com` / `password123`
     - **User**: `john.doe@example.com` / `password123`
     - **User**: `goku@videovision.com` / `password123`
     - **User**: `Tarantino@vision.com` / `tarantino`

### Common Docker Commands

```bash
# View all logs
docker-compose logs -f

# Restart containers
docker-compose restart

# Stop containers (keeps data)
docker-compose stop

# Start stopped containers
docker-compose start

# Stop and remove containers (keeps volumes)
docker-compose down

# Stop and remove everything including database data
docker-compose down -v

# Rebuild after code changes
docker-compose up --build -d

# Access PostgreSQL CLI
docker exec -it videovision-db psql -U videovision -d videovision
```

### Troubleshooting

**Container won't start:**
```bash
# Check logs for errors
docker-compose logs app
docker-compose logs postgres

# Remove containers and try again
docker-compose down -v
docker-compose up --build -d
```

**Port already in use:**
```bash
# Change ports in docker-compose.yml
# For app: "3001:3000" instead of "3000:3000"
# For db: "5433:5432" instead of "5432:5432"
```

**Database connection issues:**
```bash
# Ensure PostgreSQL container is healthy
docker-compose ps

# Check database logs
docker-compose logs postgres

# Restart with fresh database
docker-compose down -v
docker-compose up -d
```

### Development vs Production

**Docker (Production-like):**
- Uses containerized PostgreSQL
- Built application in production mode
- Isolated environment
- Automatic driver switching (pg for Docker)

**Local Development (Recommended for coding):**
- Uses Neon DB (or any PostgreSQL)
- Hot-reload enabled
- Faster iteration
- Uses neon-http driver

### Updating the Application

After making code changes:

```bash
# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

### Data Persistence

Database data persists in a Docker volume named `videovision_postgres_data`. To completely reset:

```bash
# Warning: This deletes all data!
docker-compose down -v
docker-compose up -d
```

The database will be automatically reseeded with default data.
