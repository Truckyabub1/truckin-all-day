import SwiftUI

public extension Color {
    static let theme = ColorTheme()
}

public struct ColorTheme {
    public let background = Color(hex: "090a0f")
    public let surface = Color(hex: "131620")
    public let surfaceHighlight = Color(hex: "1c202d")
    public let cyan = Color(hex: "00f2fe")
    public let amber = Color(hex: "f59e0b")
    public let green = Color(hex: "10b981")
    public let neonPink = Color(hex: "ff007f")
    public let textPrimary = Color(hex: "f8fafc")
    public let textSecondary = Color(hex: "94a3b8")
    public let border = Color(hex: "1e293b")
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
