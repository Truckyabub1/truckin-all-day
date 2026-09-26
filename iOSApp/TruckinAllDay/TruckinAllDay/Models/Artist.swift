import Foundation

struct Artist: Identifiable, Codable {
    let id: String
    let name: String
    let genre: String
    let genreCategory: String
    let badge: String
    let tagline: String
    let bio: String
    let spotifyEmbedUrl: String
    let accentColor: String
    let gameKey: String
    let gameTitle: String
    let links: ArtistLinks
}

struct ArtistLinks: Codable {
    let spotify: String?
    let apple: String?
    let youtube: String?
    let amazon: String?
    let deezer: String?
}
