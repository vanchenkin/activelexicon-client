# Service Layer Documentation

This directory contains the service layer for the application, which handles communication with the backend API.

## Mock vs Real Implementations

The application supports both mock data and real API implementations. Each service has two versions:

1. **Mock Services** - Use hardcoded data and simulate network delays for development without a backend
2. **Real Services** - Connect to the actual backend API endpoints

## How to Switch Between Mock and Real Services

To switch between mock data and real API calls, simply change the `USE_REAL_BACKEND` flag in `services/index.ts`:

```typescript
// Set to true to use real backend API calls, false to use mock data
export const USE_REAL_BACKEND = false;
```

## Available Services

The following services are available with both mock and real implementations:

- **Auth Service** - User authentication (login, register, etc.)
- **Words Service** - User vocabulary management
- **Chat Service** - AI conversation functionality
- **Exercise Service** - Language learning exercises
- **Translation Service** - Word translation and details
- **Topics Service** - Topic-based content generation
- **Vocabulary Service** - General vocabulary management

## How to Use Services in Components

Import services from the index file to ensure you're using the correct implementation:

```typescript
import { 
  authService, 
  wordsServiceInstance,
  chatServiceInstance,
  // etc...
} from '../services';

// Then use them in your component:
const words = await wordsServiceInstance.getUserWords();
```

This approach allows you to easily switch the entire application between mock and real implementations by changing a single flag. 