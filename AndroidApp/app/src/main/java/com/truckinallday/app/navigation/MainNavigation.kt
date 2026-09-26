package com.truckinallday.app.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.truckinallday.app.features.home.HomeScreen
import com.truckinallday.app.features.roster.RosterScreen
import com.truckinallday.app.features.arcade.ArcadeScreen
import com.truckinallday.app.features.store.StoreScreen
import com.truckinallday.app.features.about.AboutScreen

sealed class Screen(val route: String, val label: String, val icon: String) {
    object Home : Screen("home", "Home", "🏠")
    object Roster : Screen("roster", "Roster", "🎵")
    object Arcade : Screen("arcade", "Arcade", "🕹️")
    object Store : Screen("store", "Merch", "🛍️")
    object About : Screen("about", "About", "ℹ️")
}

val items = listOf(Screen.Home, Screen.Roster, Screen.Arcade, Screen.Store, Screen.About)

@Composable
fun MainNavigation() {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surface
            ) {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Text(screen.icon) },
                        label = { Text(screen.label) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(navController, startDestination = Screen.Home.route, Modifier.padding(innerPadding)) {
            composable(Screen.Home.route) { HomeScreen() }
            composable(Screen.Roster.route) { RosterScreen() }
            composable(Screen.Arcade.route) { ArcadeScreen() }
            composable(Screen.Store.route) { StoreScreen() }
            composable(Screen.About.route) { AboutScreen() }
        }
    }
}
