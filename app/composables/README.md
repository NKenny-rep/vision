# Composables Organization

The composables are organized into logical folders following a domain-driven approach, similar to the component structure.

## Folder Structure

```
composables/
├── auth/              # Authentication & Registration
│   ├── useAuthentication.ts
│   └── useRegistrationForm.ts
│
├── movies/            # Movie Data & Filtering
│   ├── useMovies.ts
│   ├── useMovieList.ts
│   └── useMovieFilter.ts
│
├── reviews/           # Review Management
│   └── useReviews.ts
│
├── user/              # User Profile & Management
│   ├── useProfile.ts
│   ├── useUserManagement.ts
│   ├── useUserDetails.ts
│   ├── useUserExpansion.ts
│   └── useUserTableColumns.ts
│
├── ui/                # UI Utilities
│   ├── useLazyLoad.ts
│   └── useToastNotification.ts
│
├── navigation/        # Routing & Navigation
│   └── useAppRoutes.ts
│
└── forms/             # Form Validation
    └── usePaymentValidation.ts
```

## Usage

### Nuxt Auto-Import (Recommended - No imports needed!)
Nuxt automatically imports all composables from any folder depth:
```vue
<script setup>
// No imports needed - Nuxt auto-imports everything
const { searchMovies } = useMovies()              // from movies/
const { isLoggedIn } = useAuthentication()        // from auth/
const { showSuccess } = useToastNotification()    // from ui/
</script>
```

### Explicit Import (When needed)
```typescript
// Direct import from specific file
import { useMovies } from '~/composables/movies/useMovies'
import { useAuthentication } from '~/composables/auth/useAuthentication'
```

## Benefits

✅ **Better Organization**: Related composables grouped together  
✅ **Easier Navigation**: Find composables by domain/feature  
✅ **Scalability**: Easy to add new composables to existing domains  
✅ **Follows DRY**: Index files provide clean re-export patterns  
✅ **Consistent with Components**: Mirrors component folder structure  

## Migration Notes
Auto-Import Works**: Nuxt scans all folders recursively  
✅ **Consistent with Components**: Mirrors component folder structure  
✅ **No Index Files Needed**: Simpler structure, Nuxt handles everything

## Migration Notes

All existing imports have been updated. Tests use relative imports (`./useXxx`) so they work automatically.  
**NUse it anywhere - Nuxt auto-imports it!

Example:
```typescript
// 1. Create: composables/auth/usePasswordReset.ts
export const usePasswordReset = () => {
  const resetPassword = async (email: string) => {
    // Implementation
  }
  
  return { resetPassword }
}

// 2. Use anywhere (auto-imported by Nuxt)
<script setup>
const { resetPassword } = usePasswordReset()
</script>
```

That's it! No imports needed, no index files needed. Nuxt handles everything.3. Use anywhere (auto-imported by Nuxt)
const { resetPassword } = usePasswordReset()
```
