package com.truckinallday.app.features.roster

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

data class Artist(val name: String, val genre: String)

@Composable
fun RosterScreen() {
    val artists = listOf(
        Artist("Keep on Truckin 24/7", "Outlaw Country"),
        Artist("Clockwork Hare", "Synthwave"),
        Artist("Iron Stallion Mining Music", "Southern Rock"),
        Artist("Harlan Echo", "Indie Rock")
    )

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "LABEL ROSTER",
            color = MaterialTheme.colorScheme.primary,
            style = MaterialTheme.typography.labelMedium
        )
        Spacer(modifier = Modifier.height(16.dp))
        
        LazyColumn {
            items(artists) { artist ->
                Column(modifier = Modifier.padding(vertical = 8.dp)) {
                    Text(
                        text = artist.name,
                        style = MaterialTheme.typography.titleLarge,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                    Text(
                        text = artist.genre,
                        color = MaterialTheme.colorScheme.onSurface
                    )
                }
            }
        }
    }
}
