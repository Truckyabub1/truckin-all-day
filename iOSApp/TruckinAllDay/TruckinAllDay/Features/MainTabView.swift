import SwiftUI

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }
                .tag(0)

            ArtistsListView()
                .tabItem {
                    Label("Roster", systemImage: "music.note.list")
                }
                .tag(1)

            ArcadeListView()
                .tabItem {
                    Label("Arcade", systemImage: "gamecontroller.fill")
                }
                .tag(2)

            StoreTabView()
                .tabItem {
                    Label("Merch", systemImage: "bag.fill")
                }
                .tag(3)

            AboutView()
                .tabItem {
                    Label("About", systemImage: "info.circle.fill")
                }
                .tag(4)
        }
        .accentColor(Color.theme.cyan)
    }
}
