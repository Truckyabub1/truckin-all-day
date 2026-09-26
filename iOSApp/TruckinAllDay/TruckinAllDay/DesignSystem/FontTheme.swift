import SwiftUI

public extension Font {
    static let theme = FontTheme()
}

public struct FontTheme {
    public let title = Font.system(.title, design: .default).weight(.bold)
    public let title2 = Font.system(.title2, design: .default).weight(.bold)
    public let headline = Font.system(.headline, design: .default).weight(.semibold)
    public let subheadline = Font.system(.subheadline, design: .default).weight(.medium)
    public let body = Font.system(.body, design: .default)
    public let caption = Font.system(.caption, design: .default)
    public let mono = Font.system(.body, design: .monospaced)
}
