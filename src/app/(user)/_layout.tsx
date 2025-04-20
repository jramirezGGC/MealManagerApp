/*
 * This file is part of Meal Manager.
 *
 * Meal Manager is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Meal Manager is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Meal Manager. If not, see <http://www.gnu.org/licenses/>.
 */

import type React from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import { Tabs, Stack } from "expo-router"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, SafeAreaView } from "react-native"
import { usePathname, router } from "expo-router"
import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

import Colors from "@/src/constants/Colors"
import { useColorScheme } from "@/src/components/useColorScheme"
import { useClientOnlyValue } from "@/src/components/useClientOnlyValue"
import { MealsProvider } from "@/src/context/MealsContext"

// Define the height of the tab bar for spacing
const TAB_BAR_HEIGHT = 80;

// Screen wrapper component to add bottom padding
function TabScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <View style={{ flex: 1, paddingBottom: TAB_BAR_HEIGHT }}>
      {children}
    </View>
  );
}

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"]
  color: string
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />
}

// Custom Tab Bar Component for Expo Router Tabs
function CustomTabBar({ state, descriptors, navigation }: {
  state: any;
  descriptors: any;
  navigation: any;
}) {
  const pathname = usePathname()
  
  return (
    <SafeAreaView style={styles.tabBarContainer}>
      <View style={styles.bottomNav}>
        {/* Dashboard/Home Button - Only visible when NOT on Dashboard */}
        {!pathname.includes("MainDashboard") && (
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => router.push("/(user)/MainDashboard")}
            accessibilityRole="button"
            accessibilityState={{ selected: pathname.includes("MainDashboard") }}
          >
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={[
              styles.navText, 
              pathname.includes("MainDashboard") && styles.activeNavText
            ]}>Dashboard</Text>
          </TouchableOpacity>
        )}

        {/* Only show Fridge button if not on Fridge screen */}
        {!pathname.includes("Fridge") && (
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => router.push("/(user)/Fridge")}
            accessibilityRole="button"
            accessibilityState={{ selected: pathname.includes("Fridge") }}
          >
            <Text style={styles.navIcon}>🗄️</Text>
            <Text style={[
              styles.navText, 
              pathname.includes("Fridge") && styles.activeNavText
            ]}>Fridge</Text>
          </TouchableOpacity>
        )}

        {/* Add Button - Always visible */}
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push("/(user)/CreateMeal")}
          accessibilityRole="button"
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        {/* Show Move Meals button only on Fridge screen */}
        {pathname.includes("Fridge") && (
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => router.push("/(user)/MoveMeals")}
            accessibilityRole="button"
            accessibilityState={{ selected: pathname.includes("MoveMeals") }}
          >
            <Text style={styles.navIcon}>🔄</Text>
            <Text style={[
              styles.navText, 
              pathname.includes("MoveMeals") && styles.activeNavText
            ]}>Move Meals</Text>
          </TouchableOpacity>
        )}

        {/* Settings Button - Show except on Fridge */}
        {!pathname.includes("Fridge") && (
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => router.push("/(user)/Settings")}
            accessibilityRole="button"
            accessibilityState={{ selected: pathname.includes("Settings") }}
          >
            <Text style={styles.navIcon}>⚙️</Text>
            <Text style={[
              styles.navText, 
              pathname.includes("Settings") && styles.activeNavText
            ]}>Settings</Text>
          </TouchableOpacity>
        )}
        
        {/* Pages Button - Show only on MainDashboard */}
        {/* {pathname.includes("MainDashboard") && (
          <TouchableOpacity 
            style={styles.navButton} 
            onPress={() => router.push("/(user)/Pages")}
            accessibilityRole="button"
            accessibilityState={{ selected: pathname.includes("Pages") }}
          >
            <Text style={styles.navIcon}>📑</Text>
            <Text style={[
              styles.navText, 
              pathname.includes("Pages") && styles.activeNavText
            ]}>Pages</Text>
          </TouchableOpacity>
        )} */}
      </View>
    </SafeAreaView>
  )
}

export default function UserLayout() {
  const colorScheme = useColorScheme()
  const [loading, setLoading] = useState(true)
  const [householdID, setHouseholdID] = useState<string | null>(null)

  useEffect(() => {
    const fetchHouseholdID = async () => {
      try {
        const id = await AsyncStorage.getItem("householdID")
        setHouseholdID(id)
      } catch (error) {
        console.error("Error fetching householdID:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHouseholdID()
  }, [])

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />
  }

  return (
    <MealsProvider>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: useClientOnlyValue(false, false),
          tabBarStyle: { display: "none" }, // Hide the default tab bar
        }}
        backBehavior="history"
        tabBar={(props) => <CustomTabBar {...props} />} // Pass props to CustomTabBar
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Index Screen",
            tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
            href: null,
          }}
        />

        <Tabs.Screen
          name="MainDashboard"
          options={{
            title: "Main Dashboard",
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />

        <Tabs.Screen
          name="RecoverPassword"
          options={{
            title: "Recover Password",
            tabBarIcon: ({ color }) => <TabBarIcon name="lock" color={color} />,
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
    </MealsProvider>
  )
}

const styles = StyleSheet.create({
  // Tab Bar Container to handle safe area
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    height: TAB_BAR_HEIGHT,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  // Bottom Navigation Styles
  bottomNav: {
    flexDirection: "row",
    backgroundColor: 'transparent',
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    alignItems: "center",
    width: 70,
  },
  navIcon: {
    fontSize: 22,
    color: Colors.primary,
    marginBottom: 3,
  },
  navText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  activeNavText: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 16,
  },
  addButtonText: {
    fontSize: 28,
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
