# App Store Submission Checklist

## 1. Apple Developer Account Requirements
- [ ] Active Apple Developer Program enrollment.
- [ ] Bundle Identifier registered (e.g., `com.truckinallday.app`).
- [ ] Code Signing Certificates and Provisioning Profiles generated.

## 2. App Metadata (App Store Connect)
- **App Name**: Truckin all Day
- **Subtitle**: Official Label Platform & Arcade
- **Description**: High-impact country-meets-rock storytelling, heavyweight industrial anthems, exclusive artist releases, and custom interactive games built for fans and road warriors worldwide.
- **Keywords**: Truckin all Day, Clockwork Hare, Keep on Truckin, Country Rock, Synthwave, Music Label, Arcade
- **Support URL**: `https://truckin-all-day.vercel.app/`
- **Privacy Policy URL**: Required before submission.

## 3. Assets
- [ ] App Icon (1024x1024 px).
- [ ] Screenshots (6.5" and 5.5" minimum, showing Home, Roster, Arcade, Store).

## 4. Privacy & Permissions
- [ ] App Privacy details completed in App Store Connect (Data Collection: None, unless analytics added).
- [ ] No tracking permissions requested (ATT not required unless Fourthwall uses cookies/trackers in WebView).

## 5. Review Considerations
- App relies on WebViews for games/store. Apple might flag if it appears to be *just* a wrapped website. The native SwiftUI navigation, tab architecture, native roster, and home screen help mitigate this risk.
