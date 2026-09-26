package com.truckinallday.app.features.store

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp

@Composable
fun StoreScreen() {
    val context = LocalContext.current
    val storeUrl = "https://the-purple-vixon-shop.fourthwall.com/en-cad/collections/all"

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text(
            text = "OFFICIAL MERCH STORE",
            color = MaterialTheme.colorScheme.primary,
            style = MaterialTheme.typography.labelMedium
        )
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = "The Purple Vixon Shop",
            color = MaterialTheme.colorScheme.onBackground,
            style = MaterialTheme.typography.titleLarge
        )
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Explore official Truckin all Day apparel, limited-edition vinyl pressings, tour tees, accessories, and collector merchandise powered directly by Fourthwall.",
            color = MaterialTheme.colorScheme.onSurface
        )
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Button(
            onClick = {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(storeUrl))
                context.startActivity(intent)
            },
            colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.primary)
        ) {
            Text("Enter Official Web Store 🛍️", color = MaterialTheme.colorScheme.onPrimary)
        }
    }
}
