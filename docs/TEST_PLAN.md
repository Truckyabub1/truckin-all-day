# Test Plan: Truckin all Day

## 1. Unit Tests (Android / iOS)
- **Data Models**: Verify that `Artist` and `ArcadeGame` data structures initialize correctly with their static properties.
- **Design System**: Ensure Compose `MaterialTheme` colors match exactly with iOS `ColorTheme`.

## 2. UI Tests (Jetpack Compose / XCUITest)
- **Navigation**:
  - Tap through all bottom tabs (Home, Roster, Arcade, Merch, About).
  - Verify that the Navigation Titles/Labels update accordingly.
- **Roster View**:
  - Verify that the lazy column list of artists renders completely.
- **Arcade Hub**:
  - Verify that tapping a game launches the Android `WebView` or iOS `WKWebView`.
  - Ensure the HTML5 Canvas scales correctly within the WebView bounds.
- **Store View**:
  - Verify the "Enter Official Web Store" button triggers the external `Intent` (Android) or `SFSafariViewController` (iOS).

## 3. Manual Testing
- **Web Integration**: Ensure the original Vercel web app continues to function perfectly across mobile browsers, as the native apps pull assets directly from it.
- **Responsive Layout**: 
  - Test iOS on iPhone SE (small) and iPhone 16 Pro Max (large).
  - Test Android on Pixel 4a (small) and Pixel 8 Pro (large).
- **Dark Mode**: Both applications are forced to a dark aesthetic per brand guidelines. Verify this holds true regardless of the OS-level theme settings.
