import SwiftUI
import WebKit

struct SpotifyEmbedView: UIViewRepresentable {
    let embedUrl: String
    
    func makeUIView(context: Context) -> WKWebView {
        let prefs = WKWebpagePreferences()
        prefs.allowsContentJavaScript = true
        let config = WKWebViewConfiguration()
        config.defaultWebpagePreferences = prefs
        let webView = WKWebView(frame: .zero, configuration: config)
        webView.scrollView.isScrollEnabled = false
        return webView
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        guard let url = URL(string: embedUrl) else { return }
        let request = URLRequest(url: url)
        uiView.load(request)
    }
}
