import SwiftUI

struct ArcadeGame: Identifiable {
    let id = UUID()
    let title: String
    let artist: String
    let description: String
    let slug: String
    let icon: String

    /// Builds the correct URL to launch the game.
    /// The Vercel site loads all games on the main page via JS arcade manager.
    /// We pass ?game={slug} so the page can auto-launch the correct game.
    var gameURL: String {
        "https://truckin-all-day.vercel.app/?game=\(slug)"
    }
}

struct ArcadeListView: View {
    @State private var selectedGame: ArcadeGame?

    let games: [ArcadeGame] = [
        ArcadeGame(title: "Gear Runner",        artist: "CLOCKWORK HARE",         description: "Guide the mechanical steampunk rabbit across turning brass cogs! Collect golden carrots and use helicopter ears to glide over obstacles.",         slug: "clockwork", icon: "🐰⚙️"),
        ArcadeGame(title: "Heavy Dirt Hauler",  artist: "Keep on Truckin' 24 7",  description: "Classic 18-wheeler convoy snake! Haul quartz and gold boulders across highway asphalt. Each delivery hitches dump hoppers to your train.",         slug: "hauler",    icon: "🚚🏗️"),
        ArcadeGame(title: "Ore Drill Rush",     artist: "Iron Stallion Mining",   description: "Subterranean rail cart action! Shift tracks across 3 mining rails to grind gold and iron ore while dodging razor stalactite cave-ins.",           slug: "drill",     icon: "⛏️🚜"),
        ArcadeGame(title: "Timber Hollow Trail", artist: "Harlan Echo",           description: "Appalachian mountain night cruise! Steer a vintage 1970s pickup through foggy hollows. Swerve past fallen logs and collect rare vinyl records.",   slug: "timber",    icon: "🌲🛻"),
        ArcadeGame(title: "Neon Highway 120",   artist: "Subzero Pulsewavez",     description: "120 MPH cyber synthwave speeder! Pilot a glowing neon interceptor along a wireframe highway. Blast through energy gates and avoid traffic.",       slug: "neon",      icon: "⚡🏎️"),
        ArcadeGame(title: "Dragonfly Township", artist: "Label Arcade Feature",   description: "Pilot the biomechanical dragonfly across a lakeside township! Deliver mail to target pads and dock at fuel depots to keep your tanks filled.",        slug: "dragonfly", icon: "🪰🏘️"),
    ]

    let columns = [GridItem(.flexible()), GridItem(.flexible())]

    var body: some View {
        NavigationView {
            ZStack {
                Color.theme.background.ignoresSafeArea()

                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        // Header
                        VStack(alignment: .leading, spacing: 6) {
                            Text("OFFICIAL RETRO ARCADE")
                                .font(Font.theme.caption)
                                .foregroundColor(Color.theme.cyan)
                            Text("Artist Arcade Hub")
                                .font(Font.theme.title)
                                .foregroundColor(Color.theme.textPrimary)
                            Text("Custom mini-games crafted for our headline artists — touch controls, procedural audio, and high-score tracking.")
                                .font(Font.theme.body)
                                .foregroundColor(Color.theme.textSecondary)
                        }
                        .padding(.horizontal)
                        .padding(.top, 8)

                        // Game Grid
                        LazyVGrid(columns: columns, spacing: 14) {
                            ForEach(games) { game in
                                Button {
                                    selectedGame = game
                                } label: {
                                    ArcadeGameCard(game: game)
                                }
                                .buttonStyle(PlainButtonStyle())
                            }
                        }
                        .padding(.horizontal)

                        Spacer(minLength: 80)
                    }
                    .padding(.vertical)
                }
            }
            .navigationTitle("Arcade")
            .navigationBarHidden(true)
            .fullScreenCover(item: $selectedGame) { game in
                GameContainerView(game: game)
            }
        }
    }
}

// MARK: - Arcade Game Card
struct ArcadeGameCard: View {
    let game: ArcadeGame

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Icon thumbnail
            ZStack {
                RoundedRectangle(cornerRadius: 12)
                    .fill(Color.theme.surfaceHighlight)
                    .aspectRatio(1, contentMode: .fit)
                Text(game.icon)
                    .font(.system(size: 40))
            }

            Text(game.title)
                .font(Font.theme.headline)
                .foregroundColor(Color.theme.textPrimary)
                .lineLimit(2)
                .fixedSize(horizontal: false, vertical: true)

            Text(game.artist)
                .font(Font.theme.caption)
                .foregroundColor(Color.theme.amber)
                .lineLimit(1)

            HStack {
                Image(systemName: "play.fill")
                    .font(.system(size: 10))
                Text("Play Game")
                    .font(.system(size: 11, weight: .bold))
            }
            .foregroundColor(Color.theme.cyan)
            .padding(.top, 2)
        }
        .padding(10)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color.theme.surface)
        .cornerRadius(14)
        .overlay(
            RoundedRectangle(cornerRadius: 14)
                .strokeBorder(Color.white.opacity(0.06), lineWidth: 1)
        )
    }
}

// MARK: - Game Container (Full Screen)
struct GameContainerView: View {
    @Environment(\.presentationMode) var presentationMode
    let game: ArcadeGame

    var body: some View {
        ZStack(alignment: .topLeading) {
            Color.theme.background.ignoresSafeArea()

            GameWebView(urlString: game.gameURL)
                .ignoresSafeArea(edges: .bottom)

            // Close button
            Button {
                presentationMode.wrappedValue.dismiss()
            } label: {
                ZStack {
                    Circle()
                        .fill(Color.black.opacity(0.6))
                        .frame(width: 38, height: 38)
                    Image(systemName: "xmark")
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.white)
                }
            }
            .padding(.top, 54)
            .padding(.leading, 16)
        }
    }
}
