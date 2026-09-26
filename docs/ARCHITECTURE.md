# Architecture

## Existing Vercel Architecture
- **Frontend:** Static HTML, Vanilla JS, CSS.
- **Backend:** None, purely static site hosted on Vercel.
- **Data Source:** Hardcoded content in HTML/JS, Fourthwall for merchandise.
- **Authentication:** None required for the main site. Fourthwall handles store authentication.

## Proposed iOS Architecture
- **Frameworks:** SwiftUI, Swift 5.
- **Pattern:** MVVM (Model-View-ViewModel) or simple declarative view hierarchy for static content.
- **Networking:** `URLSession` if needed for fetching remote JSON or Fourthwall APIs (if exposed), otherwise local data structs.
- **Components:**
  - `App`: Main application entry point (`@main`).
  - `Core`: Extensions and shared logic.
  - `DesignSystem`: Shared colors, fonts, and view modifiers matching the website.
  - `Features`: Feature-specific modules (Home, Roster, Arcade, Merch, About).
  - `Views`: Reusable UI components.
  - `Models`: Data representations for Artists and Games.
- **Bridging:** HTML5 Arcade Games will be hosted inside a native `WKWebView` component to preserve their procedural generation and canvas behavior, as re-writing 7 physics engines is out of scope. The hub/lobby will be 100% native SwiftUI.
- **Security:** No secrets or credentials needed for the current static setup. All web views will have restricted navigation to prevent escaping the app scope.
