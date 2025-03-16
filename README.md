# ActiveLexicon

A React Native Expo application for language learning and vocabulary building.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm
- Expo CLI

### Installation

1. Clone the repository
   ```bash
   git clone [repository-url]
   cd activelexicon
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npx expo start
   ```

## Environment Configuration

Copy `.env.example` to `.env` and configure the environment variables:

```bash
cp .env.example .env
```

Edit the `.env` file with your API configuration:

```
API_URL=https://your-api-url.com
```

## Project Structure

```
activelexicon/
├── app/                   # Expo Router application routes
│   ├── (tabs)/            # Tab-based navigation screens
│   ├── _layout.tsx        # Root layout for navigation
│   ├── login.tsx          # Login screen
│   ├── register.tsx       # Registration screen
│   ├── words.tsx          # Word management screen
│   ├── exercise.tsx       # Exercise screen
│   └── settings.tsx       # Settings screen
│
├── assets/                # Static assets like images and fonts
│
├── components/            # Reusable UI components
│   ├── Button.tsx         # Custom button component
│   ├── Input.tsx          # Custom input component
│   ├── WordItem.tsx       # Word list item component
│   ├── ProgressBar.tsx    # Progress indicator component
│   └── ...                # Other UI components
│
├── context/               # React Context providers
│   ├── AuthContext.tsx    # Authentication context
│   └── QueryContext.tsx   # React Query context
│
├── constants/             # Application constants
│
├── hooks/                 # Custom React hooks
│
├── services/              # API and data services
│   ├── api.ts             # API client setup
│   ├── authService.ts     # Authentication service
│   ├── wordsService.ts    # Words management service
│   ├── exerciseService.ts # Exercise service
│   ├── mock*.ts           # Mock services for development
│   └── ...                # Other services
│
├── types/                 # TypeScript type definitions
│
├── utils/                 # Utility functions
│   ├── config.ts          # Configuration utilities
│   └── ...                # Other utilities
│
├── .env                   # Environment variables (not in git)
├── .env.example           # Example environment variables
├── app.json               # Expo configuration
├── babel.config.js        # Babel configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies and scripts
```

## Development

### Available Scripts

- `npm start` or `yarn start`: Start the Expo development server
- `npm run android` or `yarn android`: Start the app on Android
- `npm run ios` or `yarn ios`: Start the app on iOS
- `npm run web` or `yarn web`: Start the app on web
- `npm run lint` or `yarn lint`: Run ESLint

## Built With

- [React Native](https://reactnative.dev/) - Mobile framework
- [Expo](https://expo.dev/) - React Native toolchain
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [React Query](https://tanstack.com/query) - Data fetching and state management
- [Axios](https://axios-http.com/) - HTTP client