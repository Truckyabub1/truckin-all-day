import SwiftUI

struct AboutView: View {
    var body: some View {
        NavigationView {
            ZStack {
                Color.theme.background.ignoresSafeArea()
                
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        Text("LABEL STORY")
                            .font(Font.theme.caption)
                            .foregroundColor(Color.theme.cyan)
                        
                        Text("Built For The Long Haul")
                            .font(Font.theme.title)
                            .foregroundColor(Color.theme.textPrimary)
                        
                        Text("Truckin all Day is an independent record label and creative powerhouse merging high-impact roots music with interactive digital culture.")
                            .font(Font.theme.body)
                            .foregroundColor(Color.theme.textSecondary)
                        
                        VStack(alignment: .leading, spacing: 16) {
                            AboutCard(icon: "🛣️", title: "Independent Road Ethos", description: "Born from late-night highway hauls, industrial mining towns, and gritty underground clubs, our artists craft authentic anthems with zero corporate dilution.")
                            
                            AboutCard(icon: "🕹️", title: "Interactive Fan Worlds", description: "We believe music should be experienced, not just streamed. Every headline artist release is paired with custom games, interactive lore, and collector art drops.")
                        }
                        .padding(.top, 20)
                    }
                    .padding()
                }
            }
            .navigationTitle("About")
            .navigationBarHidden(true)
        }
    }
}

struct AboutCard: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(icon)
                .font(.largeTitle)
            Text(title)
                .font(Font.theme.headline)
                .foregroundColor(Color.theme.textPrimary)
            Text(description)
                .font(Font.theme.subheadline)
                .foregroundColor(Color.theme.textSecondary)
        }
        .padding()
        .background(Color.theme.surface)
        .cornerRadius(12)
    }
}
