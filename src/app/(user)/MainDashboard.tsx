import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar as RNStatusBar } from "react-native"
import { StatusBar } from "expo-status-bar"
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import Colors from "@/src/constants/Colors"
import MealContainer from "@/src/components/MealContainer"
import { useRouter } from "expo-router"
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons"
import type { Meal } from "@/src/types"
import React, { useEffect, useState } from "react"
import { useMeals } from "@/src/context/MealsContext"

export default function MainDashboard() {
  const { meals, loading } = useMeals();
  const [fridgeMeals, setFridgeMeals] = useState<Meal[]>([]);
  const [mealCounts, setMealCounts] = useState({
    fridge: 0,
    freezer: 0,
  });
  
  const [totalServings, setTotalServings] = useState({
    fridge: 0,
    freezer: 0,
  });
  
  useEffect(() => {
    if (meals.length > 0) {
      // Filter meals that have inventory in fridge
      const mealsInFridge = meals.filter(meal => (meal.numInFridge || 0) > 0);
      setFridgeMeals(mealsInFridge);
      
      // Calculate meal counts
      const fridgeCount = meals.reduce((count, meal) => 
        count + (meal.numInFridge > 0 ? 1 : 0), 0);
      const freezerCount = meals.reduce((count, meal) => 
        count + (meal.numInFreezer > 0 ? 1 : 0), 0);
      
      setMealCounts({
        fridge: fridgeCount,
        freezer: freezerCount,
      });
      
      // Calculate total servings
      const fridgeServings = meals.reduce((total, meal) => 
        total + (meal.numInFridge || 0), 0);
      const freezerServings = meals.reduce((total, meal) => 
        total + (meal.numInFreezer || 0), 0);
      
      setTotalServings({
        fridge: fridgeServings,
        freezer: freezerServings,
      });
    }
  }, [meals]);

  const router = useRouter()
  // Navigation options
  const navigationOptions = [
    {
      id: "mealNotifs",
      title: "Meal Notifications",
      description: "Manage Meal Count Notifications",
      icon: <Feather name="package" size={32} color={Colors.white} />,
      route: "/(user)/MealNotifications",
      color: Colors.primary,
    },
    {
      id: "mealManager",
      title: "Manage Refrigerator",
      description: "Edit and move meals",
      icon: <MaterialIcons name="restaurant-menu" size={32} color={Colors.white} />,
      route: "/(user)/Fridge",
      color: "#4CAF50", // Green color
    },
    {
      id: "savedMeals",
      title: "Saved Meals",
      description: "View meal history",
      icon: <Ionicons name="time" size={32} color={Colors.white} />,
      route: "/(user)/SavedMeals",
      color: "#FF9800", // Orange color
    },
  ]

  // Render the header content (stats and navigation cards)
  const renderHeader = () => (
    <>
      {/* Stats Container - Using real data for Fridge and Freezer counts */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mealCounts.fridge}</Text>
          <Text style={styles.statLabel}>Fridge Meals</Text>
          <Text style={styles.statServings}>
            {totalServings.fridge} total servings
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{mealCounts.freezer}</Text>
          <Text style={styles.statLabel}>Freezer Meals</Text>
          <Text style={styles.statServings}>
            {totalServings.freezer} total servings
          </Text>
        </View>
      </View>

      {/* Navigation Cards */}
      <View style={styles.navigationContainer}>
        {navigationOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[styles.navigationCard, { backgroundColor: option.color }]}
            onPress={() => router.push(option.route as any)}
          >
            <View style={styles.navigationIconContainer}>{option.icon}</View>
            <View style={styles.navigationTextContainer}>
              <Text style={styles.navigationTitle}>{option.title}</Text>
              <Text style={styles.navigationDescription}>{option.description}</Text>
            </View>
            <View style={styles.navigationArrow}>
              <Text style={styles.navigationArrowText}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  )

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
        <StatusBar style="dark" />

        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Welcome Back</Text>
          </View>
          <Text style={styles.headerSubtitle}>Your meal dashboard</Text>
        </View>

        {/* Content Section - Using MealContainer with real meals data */}
        <View style={styles.contentWrapper}>
          <MealContainer
            meals={fridgeMeals}
            ListHeaderComponent={renderHeader()}
            contentContainerStyle={styles.mealContainerContent}
            router={router}
          />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? (RNStatusBar.currentHeight || 24) + 10 : 0,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  mealContainerContent: {
    paddingTop: 24,
    paddingBottom: 100, // Extra padding for bottom navigation
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statServings: {
    fontSize: 12,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.textTertiary,
    opacity: 0.3,
  },
  navigationContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  navigationCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigationIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  navigationTextContainer: {
    flex: 1,
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 4,
  },
  navigationDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  navigationArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  navigationArrowText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
  },
})
