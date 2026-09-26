import Foundation

/// Authentication service stub for future integration with Apple Sign In / Google Sign In.
/// Currently provides mock authentication for UI development.
class AuthenticationService: ObservableObject {
    static let shared = AuthenticationService()
    
    @Published var isAuthenticated: Bool = false
    
    private let tokenKey = "auth_token"
    
    init() {
        self.isAuthenticated = UserDefaults.standard.string(forKey: tokenKey) != nil
    }
    
    func login() async throws {
        // Mock authentication delay
        try await Task.sleep(nanoseconds: 1_000_000_000)
        
        DispatchQueue.main.async {
            UserDefaults.standard.set("dummy_token", forKey: self.tokenKey)
            self.isAuthenticated = true
        }
    }
    
    func logout() {
        DispatchQueue.main.async {
            UserDefaults.standard.removeObject(forKey: self.tokenKey)
            self.isAuthenticated = false
        }
    }
}
