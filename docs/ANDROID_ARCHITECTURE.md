# Android Architecture

## Core Technology Stack
- **Language**: Kotlin 1.9+
- **UI Toolkit**: Jetpack Compose (Material 3)
- **Architecture Pattern**: MVVM (Model-View-ViewModel) with Clean Architecture principles.
- **Asynchrony**: Kotlin Coroutines & Flow.
- **Networking**: Retrofit 2 + OkHttp (communicating with the shared Vercel backend).
- **Serialization**: Kotlinx Serialization.
- **Navigation**: Jetpack Navigation Compose.
- **Image Loading**: Coil.

## Module Structure
The native application will reside in a new `/AndroidApp` module to clearly distinguish it from the deprecated Capacitor wrapper (`/android-app`).

```
/AndroidApp
  /app
    /src/main/java/com/truckinallday/app
      /core             # Theme, Design System, Extensions
      /data             # Repositories, API client, DTOs
      /domain           # Models, UseCases
      /navigation       # NavGraphs, Routes
      /ui               # Shared UI components
      /features         # Feature modules
        /home
        /roster
        /arcade
        /store
        /about
```

## State Management
- `StateFlow` will be used to expose immutable UI state from ViewModels to Compose screens.
- UDF (Unidirectional Data Flow) will be strictly enforced.

## Security & Storage
- **Keystore**: Android Keystore system used for any secure token storage.
- **DataStore**: Jetpack DataStore (Preferences) used for local settings (e.g., dark mode overrides, seen tutorials).
- **Network Security**: Enforced `NetworkSecurityConfig.xml` to disallow cleartext traffic.

## Bridging Web Content
- `WebView` with customized `WebViewClient` will be used exclusively for the HTML5 Canvas Arcade Games to ensure procedural mechanics function correctly without a full physics engine rewrite.
- **Chrome Custom Tabs** will be used for navigating to the Fourthwall Merch Store to preserve PCI compliance and session sharing.
