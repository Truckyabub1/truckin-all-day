import SwiftUI
import WebKit

/// WKWebView wrapper that loads arcade games from the live Vercel site.
/// The game canvas pages live at: https://truckin-all-day.vercel.app/
/// Games are launched by the JS arcade manager via hash/query params.
struct GameWebView: UIViewRepresentable {
    let urlString: String

    func makeUIView(context: Context) -> WKWebView {
        let prefs = WKWebpagePreferences()
        prefs.allowsContentJavaScript = true

        let config = WKWebViewConfiguration()
        config.defaultWebpagePreferences = prefs
        config.allowsInlineMediaPlayback = true
        config.mediaTypesRequiringUserActionForPlayback = []

        // Allow audio without user gesture (needed for canvas game audio)
        let audioKey = "allowsAirPlayForMediaPlayback"
        config.setValue(true, forKey: audioKey)

        let webView = WKWebView(frame: .zero, configuration: config)
        webView.navigationDelegate = context.coordinator
        webView.scrollView.isScrollEnabled = false
        webView.scrollView.bounces = false
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 9/255, green: 10/255, blue: 15/255, alpha: 1)
        webView.scrollView.backgroundColor = webView.backgroundColor

        // Enable inspect from Safari dev tools during dev
        if #available(iOS 16.4, *) {
            webView.isInspectable = false
        }

        return webView
    }

    func updateUIView(_ uiView: WKWebView, context: Context) {
        guard let url = URL(string: urlString) else { return }
        // Only reload if URL changed
        if uiView.url?.absoluteString != urlString {
            var request = URLRequest(url: url)
            request.cachePolicy = .useProtocolCachePolicy
            uiView.load(request)
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, WKNavigationDelegate {
        var parent: GameWebView

        init(_ parent: GameWebView) {
            self.parent = parent
        }

        func webView(_ webView: WKWebView, decidePolicyFor navigationAction: WKNavigationAction,
                     decisionHandler: @escaping (WKNavigationActionPolicy) -> Void) {
            guard let url = navigationAction.request.url else {
                decisionHandler(.allow)
                return
            }
            let allowedHosts = [
                "truckin-all-day.vercel.app",
                "truckinallday.netlify.app",
                "open.spotify.com",
                "the-purple-vixon-shop.fourthwall.com"
            ]
            if url.scheme == "about" || url.scheme == "blob" {
                decisionHandler(.allow)
            } else if let host = url.host, allowedHosts.contains(host) {
                decisionHandler(.allow)
            } else if navigationAction.navigationType == .linkActivated {
                // Open external links in Safari instead of inside the game view
                UIApplication.shared.open(url)
                decisionHandler(.cancel)
            } else {
                decisionHandler(.allow)
            }
        }

        func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
            // Inject JS to signal native context so the game can disable animations
            // that don't work well inside WKWebView (e.g., window.open calls)
            webView.evaluateJavaScript("window.__TRUCKIN_IOS_NATIVE__ = true;", completionHandler: nil)
        }
    }
}
