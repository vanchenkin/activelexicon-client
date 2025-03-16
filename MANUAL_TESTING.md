# ActiveLexicon Manual Testing Scripts

This document outlines the scripts and procedures for manually testing the ActiveLexicon application.

## Setup Scripts

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit the .env file with your configuration
```

## Development Server Scripts

```bash
# Start the Expo development server
npm start
# or 
expo start

# Start on specific platforms
npm run android  # Start on Android
npm run ios      # Start on iOS
npm run web      # Start on web browser
```

## Testing Scripts

```bash
# Run Jest test suite with watch mode
npm test

# Run linting
npm run lint
```

## Playwright E2E Testing

```bash
# Install Playwright dependencies (one-time setup)
npm install --save-dev @playwright/test

# Install Playwright browsers
npx playwright install

# Run all Playwright tests
npm run test:e2e

# Run only the smoke test
npm run test:smoke

# Run tests with UI mode for debugging
npx playwright test --ui

# Run tests on specific browsers
npx playwright test --project=chromium
npx playwright test --project="Mobile Chrome"
```

## Platform-Specific Testing

### Android Testing

```bash
# Build and run on Android
npm run android
# or
npx expo run:android
```

### iOS Testing

```bash
# Build and run on iOS
npm run ios
# or
npx expo run:ios
```

## Manual Testing Checklist

### Authentication Flows
- User registration
  - Valid email format validation
  - Password strength requirements
  - Duplicate email handling
  - Successful registration flow completion
  - Email verification process
- User login
  - Successful login with valid credentials
  - Error handling for incorrect password
  - Error handling for non-existent user
  - "Remember me" functionality
- Password reset
  - Forgot password flow
  - Reset link validity
  - New password requirements
  - Confirmation of reset
- Session persistence
  - App restart session retention
  - Token refresh mechanism
  - Session timeout handling
- Logout
  - Clean logout (all tokens cleared)
  - Redirect to login screen
  - Prevention of back navigation after logout

### Word Management
- Add new words
  - Basic word addition with translation
  - Adding words with additional metadata (part of speech, examples)
  - Duplicate word handling
  - Word with special characters
  - Very long words
- Edit existing words
  - Modify translation
  - Update examples
  - Change part of speech
  - Add/remove tags
- Delete words
  - Single word deletion
  - Batch delete functionality
  - Confirmation dialog
  - Undo delete option
- Search functionality
  - Search by word
  - Search by translation
  - Search by tag/category
  - Empty search results handling
  - Special character search
- Word categorization
  - Create new category
  - Assign word to category
  - Move word between categories
  - Delete category (with handling of assigned words)
- Import/Export
  - Import word list from file
  - Export vocabulary to file
  - Handling of import errors

### Exercise Functionality
- Different exercise types
  - Translation exercises
  - Multiple choice quizzes
  - Fill-in-the-blank exercises
  - Matching exercises
  - Spelling exercises
  - Listening comprehension
- Exercise completion
  - Correct answer handling
  - Incorrect answer feedback
  - Retry mechanism
  - Exercise completion summary
  - Scoring system accuracy
- Progress tracking
  - Daily progress visualization
  - Weekly/monthly statistics
  - Exercise history
  - Success rate by exercise type
  - Success rate by word category
- Streak updates
  - Daily streak increment
  - Streak maintenance rules
  - Streak reset conditions
  - Streak milestone celebrations
  - Streak recovery grace period

### User Profile
- Profile information display
  - User details rendering
  - Profile picture upload and display
  - Profile edit functionality
  - Profile data validation
- Stats visualization
  - Learning progress charts
  - Words learned counter
  - Time spent learning
  - Accuracy metrics
  - Activity heatmap
- Achievement tracking
  - Achievement unlock conditions
  - Achievement display
  - Achievement notifications
  - Progress towards locked achievements
- Streak monitoring
  - Current streak display
  - Streak history
  - Longest streak record
  - Streak calendar visualization

### Settings & Preferences
- Theme switching
  - Light theme appearance
  - Dark theme appearance
  - System theme following
  - Theme switching animation
- Notification preferences
  - Daily reminder settings
  - Reminder time selection
  - Push notification opt-out
  - Silent mode handling
- Account settings
  - Email change
  - Password change
  - Account deletion process
  - Data export option
- App configuration
  - Language selection
  - Exercise difficulty settings
  - Daily goals configuration
  - Audio settings
  - Data usage settings

### Cross-Platform Testing
- Verify UI consistency across platforms
  - Component rendering differences
  - Layout adaptations
  - Platform-specific UI conventions
  - Font rendering consistency
- Test responsive layouts on different screen sizes
  - Small phone screens
  - Large phone screens
  - Tablet layouts
  - Desktop browser (web version)
  - Orientation changes (portrait/landscape)
- Check platform-specific features
  - Notifications rendering
  - Deep linking behavior
  - Sharing functionality
  - Native integration points

## Accessibility Testing
- Screen reader compatibility
  - VoiceOver (iOS)
  - TalkBack (Android)
  - Proper element labeling
  - Navigation via screen reader
- Color contrast
  - Text readability on all backgrounds
  - Interactive element distinction
  - Color-blind friendly design
- Font scaling
  - Dynamic type support (iOS)
  - Font size adjustment (Android)
  - Layout stability with large fonts
- Input methods
  - Keyboard navigation
  - Voice input functionality
  - Gesture alternatives

## Network Condition Testing
- Slow connection handling
  - Loading states
  - Graceful failure
  - Retry mechanisms
  - Bandwidth optimization
- Offline mode
  - Cached content access
  - Offline exercise functionality
  - Queue of actions to sync later
  - Offline to online transition
- Intermittent connectivity
  - Recovery after connection loss
  - Data integrity maintenance
  - Session persistence

## Data Persistence Testing
- Application state
  - State preservation across restarts
  - Recovery after crash
  - Background/foreground transitions
- User data
  - Word list persistence
  - Learning progress retention
  - User preferences saving
  - Exercise history

## Security Testing
- Data encryption
  - Secure storage of credentials
  - API token security
  - Personal data protection
- Authentication security
  - Session timeout handling
  - Invalid session detection
  - Multiple device login handling

## Integration Testing
- Features interaction
  - Word addition to exercises flow
  - Profile stats from exercise results
  - Settings affecting exercise behavior
  - Notification leading to correct screen

## Performance Testing
- App launch time
  - Cold start performance
  - Warm start speed
  - Launch screen to interactive time
- UI responsiveness
  - Scroll performance
  - Animation smoothness
  - Input lag
  - Transition effects
- Network request handling
  - Request batching
  - Error recovery
  - Cancellation handling
  - Progress indication
- Offline functionality
  - Feature availability offline
  - Synchronization upon reconnection
- Memory usage
  - Extended usage stability
  - Image loading optimization
  - List rendering efficiency
- Battery consumption
  - Background activity impact
  - Animation power usage
  - Location/bluetooth usage if applicable

## Localization Testing
- Interface translation
  - Text display in all supported languages
  - Layout adaptation for different text lengths
  - RTL language support if applicable
- Content adaptation
  - Date and time formats
  - Number formatting
  - Cultural appropriateness

## E2E Testing Notes
While automated E2E testing is preferred for comprehensive validation, these manual testing scripts cover the essential functionality for regular testing during development.