import SwiftUI

struct ArtistsListView: View {
    @State private var artists: [Artist] = []
    @State private var isLoading = true
    @State private var errorMessage: String? = nil
    @State private var activeEmbedId: String? = nil

    var body: some View {
        NavigationView {
            ZStack {
                Color.theme.background.ignoresSafeArea()

                if isLoading {
                    VStack(spacing: 16) {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: Color.theme.cyan))
                            .scaleEffect(1.4)
                        Text("Loading Roster...")
                            .font(Font.theme.caption)
                            .foregroundColor(Color.theme.textSecondary)
                    }
                } else if let error = errorMessage {
                    VStack(spacing: 16) {
                        Text("⚠️")
                            .font(.largeTitle)
                        Text(error)
                            .font(Font.theme.body)
                            .foregroundColor(Color.theme.textSecondary)
                            .multilineTextAlignment(.center)
                        Button("Retry") {
                            Task { await loadArtists() }
                        }
                        .padding(.horizontal, 24)
                        .padding(.vertical, 10)
                        .background(Color.theme.cyan)
                        .foregroundColor(.black)
                        .cornerRadius(10)
                        .fontWeight(.bold)
                    }
                    .padding()
                } else if artists.isEmpty {
                    VStack(spacing: 12) {
                        Text("🎸")
                            .font(.largeTitle)
                        Text("No artists found.")
                            .foregroundColor(Color.theme.textSecondary)
                    }
                } else {
                    ScrollView {
                        VStack(spacing: 0) {
                            // Header
                            VStack(alignment: .leading, spacing: 6) {
                                Text("OFFICIAL LABEL ROSTER")
                                    .font(Font.theme.caption)
                                    .foregroundColor(Color.theme.cyan)
                                Text("5 Signature Artists")
                                    .font(Font.theme.title)
                                    .foregroundColor(Color.theme.textPrimary)
                                Text("High-impact outlaw country, southern rock, steampunk & retrowave catalog.")
                                    .font(Font.theme.body)
                                    .foregroundColor(Color.theme.textSecondary)
                            }
                            .frame(maxWidth: .infinity, alignment: .leading)
                            .padding()

                            ForEach(artists) { artist in
                                ArtistCard(
                                    artist: artist,
                                    isEmbedOpen: activeEmbedId == artist.id,
                                    onToggleEmbed: {
                                        withAnimation(.easeInOut(duration: 0.25)) {
                                            activeEmbedId = activeEmbedId == artist.id ? nil : artist.id
                                        }
                                    }
                                )
                                .padding(.horizontal)
                                .padding(.bottom, 12)
                            }

                            Spacer(minLength: 80)
                        }
                    }
                }
            }
            .navigationTitle("Roster")
            .navigationBarHidden(true)
        }
        .task {
            await loadArtists()
        }
    }

    private func loadArtists() async {
        isLoading = true
        errorMessage = nil
        do {
            self.artists = try await APIClient.shared.fetchArtists()
        } catch {
            self.errorMessage = "Could not load artist roster.\n\(error.localizedDescription)"
        }
        isLoading = false
    }
}

// MARK: - Artist Card
struct ArtistCard: View {
    let artist: Artist
    let isEmbedOpen: Bool
    let onToggleEmbed: () -> Void

    var accentUIColor: Color {
        // Use ColorTheme's non-failable hex init (strips # if present)
        let hex = artist.accentColor.trimmingCharacters(in: .init(charactersIn: "#"))
        return Color(hex: hex)
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Badge + Name
            VStack(alignment: .leading, spacing: 4) {
                Text(artist.badge)
                    .font(.system(size: 9, weight: .bold))
                    .tracking(1.5)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(accentUIColor.opacity(0.15))
                    .foregroundColor(accentUIColor)
                    .cornerRadius(4)

                Text(artist.name)
                    .font(Font.theme.headline)
                    .foregroundColor(Color.theme.textPrimary)

                Text(artist.genre)
                    .font(Font.theme.caption)
                    .foregroundColor(Color.theme.textSecondary)
            }

            // Tagline
            HStack(spacing: 0) {
                Rectangle()
                    .frame(width: 2)
                    .foregroundColor(accentUIColor)
                Text(""\(artist.tagline)"")
                    .font(Font.theme.body)
                    .italic()
                    .foregroundColor(.gray)
                    .padding(.leading, 8)
            }
            .frame(height: nil)

            // Bio
            Text(artist.bio)
                .font(Font.theme.body)
                .foregroundColor(Color.theme.textSecondary)
                .lineLimit(3)

            // Spotify Preview toggle
            Button(action: onToggleEmbed) {
                HStack(spacing: 6) {
                    Image(systemName: isEmbedOpen ? "stop.circle.fill" : "play.circle.fill")
                        .foregroundColor(isEmbedOpen ? .white : Color(hex: "1DB954"))
                    Text(isEmbedOpen ? "Close Preview" : "Spotify Preview")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(isEmbedOpen ? .white : Color.theme.textPrimary)
                }
                .padding(.horizontal, 12)
                .padding(.vertical, 7)
                .background(isEmbedOpen ? Color(hex: "#1DB954")?.opacity(0.9) ?? Color.green : Color.white.opacity(0.07))
                .cornerRadius(10)
            }

            // Spotify Embed
            if isEmbedOpen {
                SpotifyEmbedView(embedUrl: artist.spotifyEmbedUrl)
                    .frame(height: 152)
                    .cornerRadius(12)
            }

            // Streaming links
            StreamingLinksRow(links: artist.links)
        }
        .padding()
        .background(Color.theme.surface)
        .cornerRadius(16)
    }
}

// MARK: - Streaming Links
struct StreamingLinksRow: View {
    let links: ArtistLinks

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                if let url = links.spotify {
                    StreamingLinkButton(label: "Spotify", emoji: "🟢", url: url)
                }
                if let url = links.apple {
                    StreamingLinkButton(label: "Apple", emoji: "🍎", url: url)
                }
                if let url = links.youtube {
                    StreamingLinkButton(label: "YouTube", emoji: "▶️", url: url)
                }
                if let url = links.amazon {
                    StreamingLinkButton(label: "Amazon", emoji: "📦", url: url)
                }
                if let url = links.deezer {
                    StreamingLinkButton(label: "Deezer", emoji: "🟣", url: url)
                }
            }
        }
    }
}

struct StreamingLinkButton: View {
    let label: String
    let emoji: String
    let url: String

    var body: some View {
        Link(destination: URL(string: url)!) {
            HStack(spacing: 4) {
                Text(emoji)
                    .font(.system(size: 11))
                Text(label)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.gray)
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 6)
            .background(Color.white.opacity(0.05))
            .cornerRadius(8)
        }
    }
}



