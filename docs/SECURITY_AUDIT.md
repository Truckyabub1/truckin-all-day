# Security Audit: Truckin all Day

## Overview
This document reviews the security posture of both the iOS and Android native applications and their integration with the Vercel-hosted frontend and Fourthwall merch store.

## Current Architecture
- **Frontend / Backend**: The application relies on external static assets (HTML5, Javascript) and external embeds (Spotify, Fourthwall).
- **Authentication**: There is no direct user login on the main platform. The Fourthwall store handles its own secure checkout process.
- **Secrets**: No secrets or API keys are embedded in either native client.

## Android Security Configuration
- **Network Security**: Uses standard Android security protocols (HTTPS enforced). Cleartext traffic is disabled by default on modern API levels.
- **WebViews (Arcade Games)**: `WebViewClient` is explicitly attached in Compose (`ArcadeScreen.kt`) to ensure that basic sandboxing is active. External game mechanics function, but navigating outward to unknown malicious URLs is restricted.
- **Chrome Custom Tabs / Intents (Store)**: Purchasing flow kicks out securely to Android's Intent system or Custom Tabs. The native app does not scrape or store PCI/credit card data.
- **Local Storage**: The application requires no local persistence of sensitive user data. `DataStore` or `SharedPreferences` are unused at this stage.

## iOS Security Configuration
- **Network Security**: App Transport Security (ATS) enforces HTTPS.
- **WebViews**: `WKWebView` handles the arcade with a `WKNavigationDelegate` that strictly limits outbound domains to known properties (Vercel, Fourthwall).
- **Keychain**: Unused.

## Action Items Before Release
1. Verify Google Play App Signing key integrity.
2. Review Fourthwall's SDK/API if a native checkout flow is implemented in the future, ensuring PCI compliance is maintained on their end.
