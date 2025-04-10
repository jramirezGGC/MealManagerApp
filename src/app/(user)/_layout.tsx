import type React from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Tabs } from "expo-router"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { usePathname, router } from "expo-router"

import Colors from "@/src/constants/Colors"
import { useColorScheme } from "@/src/components/useColorScheme"
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue"

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"]
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

// Custom Tab Bar Component
function CustomTabBar() {
  const pathname = usePathname()
  const isMainDashboard = pathname.includes("MainDashboard")
  const isFridge = pathname.includes("Fridge")

  // Main Dashboard navigation
  if (isMainDashboard) {
    return (
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/Fridge")}>
          <Text style={styles.navIcon}>🗄️</Text>
          <Text style={styles.navText}>Fridge</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(user)/CreateMeal")}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/Settings")}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/Pages")}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Pages</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Fridge screen navigation
  if (isFridge) {
    return (
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/MainDashboard")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(user)/CreateMeal")}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/MoveMeals")}>
          <Text style={styles.navIcon}>🔄</Text>
          <Text style={styles.navText}>Move Meals</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Default navigation for all other screens
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/MainDashboard")}>
        <Text style={styles.navIcon}>🏠</Text>
        <Text style={styles.navText}>Dashboard</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(user)/CreateMeal")}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/Settings")}>
        <Text style={styles.navIcon}>⚙️</Text>
        <Text style={styles.navText}>Settings</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function TabLayout() {
  const colorScheme = useColorScheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, false),
        tabBarStyle: { display: "none" }, // Hide the default tab bar
      }}
      backBehavior="history"
      tabBar={() => <CustomTabBar />} // Use our custom tab bar
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Index Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          // removed modal from tab one, but left code as reference
          // headerRight: () => (
          //   <Link href="/modal" asChild>
          //     <Pressable>
          //       {({ pressed }) => (
          //         <FontAwesome
          //           name="info-circle"
          //           size={25}
          //           color={Colors[colorScheme ?? 'light'].text}
          //           style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
          //         />
          //       )}
          //     </Pressable>
          //   </Link>
          // ),
          href: null,
        }}
      />

      <Tabs.Screen
        name="MainDashboard"
        options={{
          title: "Main Dashboard",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />

      <Tabs.Screen
        name="RecoverPassword"
        options={{
          title: "Recover Password",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="EditMeal"
        options={{
          title: "Edit Meal Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="MoveMeals"
        options={{
          title: "Move Meals Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="Fridge"
        options={{
          title: "Fridge Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="Inventory"
        options={{
          title: "Inventory Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="CreateMeal"
        options={{
          title: "Create Meal Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="SavedMeals"
        options={{
          title: "Saved Meals Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="ConfirmMeal"
        options={{
          title: "Confirm Meal Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="EditProfile"
        options={{
          title: "Edit Profile Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="ManageHousehold"
        options={{
          title: "Manage Household Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="[id]"
        options={{
          title: "Meal Details Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="Gallery"
        options={{
          title: "Gallery Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="RecreateMeal"
        options={{
          title: "Recreate Meal Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
          href: null,
        }}
      />

      <Tabs.Screen
        name="Pages"
        options={{
          title: "Pages screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
        }}
      />

      <Tabs.Screen
        name="Settings"
        options={{
          title: "Settings Screen",
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />

      <Tabs.Screen
        name="MealNotifications"
        options={{
          title: "Meal Notifications",
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
    width: 80,
  },
  navIcon: {
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: "300",
  },

  // Settings-style Navigation Styles - keeping this for reference but not using it anymore
  settingsNav: {
    flexDirection: "row",
    backgroundColor: Colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 12,
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  settingsNavItem: {
    alignItems: "center",
    flex: 1,
  },
  settingsNavIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  settingsNavIcon: {
    fontSize: 20,
  },
  settingsNavTitle: {
    fontSize: 12,
    fontWeight: "500",
    color: Colors.white,
  },
})
