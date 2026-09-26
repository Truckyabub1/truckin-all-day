import SwiftUI

struct HomeView: View {
    var body: some View {
        NavigationView {
            ZStack {
                Color.theme.background.ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        Text("⚡ OFFICIAL RECORD LABEL PLATFORM")
                            .font(Font.theme.caption)
                            .foregroundColor(Color.theme.cyan)
                            .padding(.top, 40)
                        
                        Text("Truckin all Day")
                            .font(Font.theme.title)
                            .foregroundColor(Color.theme.textPrimary)
                        
                        Text("Soundtracks for the Open Road")
                            .font(Font.theme.headline)
                            .foregroundColor(Color.theme.amber)
                        
                        Text("High-impact country-meets-rock storytelling, heavyweight industrial anthems, exclusive artist releases, and custom interactive games built for fans and road warriors worldwide.")
                            .font(Font.theme.body)
                            .foregroundColor(Color.theme.textSecondary)
                            .padding(.vertical)
                        
                        HStack {
                            VStack(alignment: .leading) {
                                Text("5")
                                    .font(Font.theme.title)
                                    .foregroundColor(Color.theme.cyan)
                                Text("Signature Artists")
                                    .font(Font.theme.caption)
                                    .foregroundColor(Color.theme.textSecondary)
                            }
                            Spacer()
                            VStack(alignment: .leading) {
                                Text("5")
                                    .font(Font.theme.title)
                                    .foregroundColor(Color.theme.cyan)
                                Text("Arcade Games")
                                    .font(Font.theme.caption)
                                    .foregroundColor(Color.theme.textSecondary)
                            }
                        }
                        .padding()
                        .background(Color.theme.surface)
                        .cornerRadius(12)
                        
                        Spacer()
                    }
                    .padding()
                }
            }
            .navigationTitle("Home")
            .navigationBarHidden(true)
        }
    }
}
