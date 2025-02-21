import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"

export default function InventoryScreen() {
  const menuItems = [
    {
      id: 1,
      title: "Manage Household",
      icon: "👥",
      route: "/manage-household",
    },
    {
      id: 2,
      title: "Create Meals",
      icon: "🍲",
      route: "/create-meals",
    },
    {
      id: 3,
      title: "Move Meals",
      icon: "⚙️",
      route: "/move-meals",
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory</Text>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuItemBorder]}
            /*onPress={() => } */
          >
            <View style={styles.menuContent}>
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavButton} /*onPress={() => } */>
          <Text style={styles.bottomNavText}>Fridge</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomNavButton} /*onPress={() => } */>
          <Text style={styles.bottomNavText}>Freezer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f2dc",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === "android" ? 16 : 0,
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    fontSize: 32,
    color: "#4e752d",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 8,
    color: "#32343e",
  },
  menuContainer: {
    backgroundColor: "#74af44",
    margin: 16,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  menuContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  menuText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  chevron: {
    color: "white",
    fontSize: 24,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#74af44",
    padding: 16,
    marginTop: "auto",
  },
  bottomNavButton: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 12,
    borderRadius: 24,
    marginHorizontal: 8,
    alignItems: "center",
  },
  bottomNavText: {
    color: "#4e752d",
    fontSize: 16,
    fontWeight: "600",
  },
})
