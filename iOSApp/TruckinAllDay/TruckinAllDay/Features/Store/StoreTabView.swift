import SwiftUI

struct StoreTabView: View {
    @State private var showSafari = false
    let storeURL = URL(string: "https://the-purple-vixon-shop.fourthwall.com/en-cad/collections/all")!
    
    var body: some View {
        NavigationView {
            ZStack {
                Color.theme.background.ignoresSafeArea()
                
                VStack(alignment: .leading, spacing: 20) {
                    Text("OFFICIAL MERCH STORE")
                        .font(Font.theme.caption)
                        .foregroundColor(Color.theme.cyan)
                        .padding(.top)
                    
                    Text("The Purple Vixon Shop")
                        .font(Font.theme.title)
                        .foregroundColor(Color.theme.textPrimary)
                    
                    Text("Explore official Truckin all Day apparel, limited-edition vinyl pressings, tour tees, accessories, and collector merchandise powered directly by Fourthwall.")
                        .font(Font.theme.body)
                        .foregroundColor(Color.theme.textSecondary)
                        .padding(.vertical)
                    
                    Button {
                        showSafari = true
                    } label: {
                        HStack {
                            Spacer()
                            Text("Enter Official Web Store 🛍️")
                                .font(Font.theme.headline)
                                .foregroundColor(.black)
                                .padding()
                            Spacer()
                        }
                        .background(Color.theme.cyan)
                        .cornerRadius(12)
                    }
                    .padding(.top)
                    
                    Spacer()
                }
                .padding()
            }
            .navigationTitle("Official Merch")
            .navigationBarHidden(true)
            .fullScreenCover(isPresented: $showSafari) {
                SafariView(url: storeURL)
                    .ignoresSafeArea()
            }
        }
    }
}
