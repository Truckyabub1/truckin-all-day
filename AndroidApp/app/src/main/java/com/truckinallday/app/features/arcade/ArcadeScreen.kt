package com.truckinallday.app.features.arcade

import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView

data class ArcadeGame(val title: String, val artist: String, val slug: String)

@Composable
fun ArcadeScreen() {
    var selectedGame by remember { mutableStateOf<ArcadeGame?>(null) }
    
    val games = listOf(
        ArcadeGame("Gear Runner", "CLOCKWORK HARE", "clockwork"),
        ArcadeGame("Heavy Dirt Hauler", "Keep on Truckin' 24 7", "hauler"),
        ArcadeGame("Ore Drill Rush", "Iron Stallion Mining", "drill"),
        ArcadeGame("Timber Hollow Trail", "Harlan Echo", "timber"),
        ArcadeGame("Neon Highway 120", "Subzero Pulsewavez", "neon")
    )

    if (selectedGame != null) {
        // Render Web View for HTML5 Canvas Game
        Column(modifier = Modifier.fillMaxSize()) {
            Button(onClick = { selectedGame = null }) {
                Text("Back to Arcade")
            }
            AndroidView(
                factory = { context ->
                    WebView(context).apply {
                        settings.javaScriptEnabled = true
                        webViewClient = WebViewClient() // Basic security/navigation lock
                        loadUrl("https://truckin-all-day.vercel.app/arcade/${selectedGame!!.slug}.html")
                    }
                },
                modifier = Modifier.fillMaxSize()
            )
        }
    } else {
        Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
            Text(
                text = "OFFICIAL RETRO ARCADE",
                color = MaterialTheme.colorScheme.primary,
                style = MaterialTheme.typography.labelMedium
            )
            Spacer(modifier = Modifier.height(16.dp))
            
            LazyVerticalGrid(
                columns = GridCells.Fixed(2),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(games) { game ->
                    Card(
                        onClick = { selectedGame = game },
                        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("🕹️", style = MaterialTheme.typography.headlineLarge)
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(game.title, color = MaterialTheme.colorScheme.onBackground)
                            Text(game.artist, color = MaterialTheme.colorScheme.secondary, style = MaterialTheme.typography.labelSmall)
                        }
                    }
                }
            }
        }
    }
}
