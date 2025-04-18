/* global jest */
import { mockAsyncStorage } from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo-constants', () => ({
  Constants: {
    manifest: {
      extra: {
        apiUrl: 'https://mock-api-url.com',
      },
    },
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn().mockReturnValue({}),
  Stack: {
    Screen: jest.fn(),
  },
  useSegments: jest.fn().mockReturnValue([]),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn().mockReturnValue({
    setQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
  }),
  useQuery: jest.fn().mockReturnValue({
    data: undefined,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
  useMutation: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isPending: false,
    error: null,
  }),
}));

global.__reanimatedWorkletInit = jest.fn();
jest.mock('react-native-reanimated', () =>
  require('react-native-reanimated/mock')
);

const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes(
      'Warning: The current testing environment is not configured to support act'
    ) ||
      args[0].includes('Warning: You are importing createBottomTabNavigator') ||
      args[0].includes('Warning: React.createFactory()'))
  ) {
    return;
  }
  originalConsoleError(...args);
};
