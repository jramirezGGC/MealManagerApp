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
  const { meals, loading, deleteMeal, syncWithDatabase, refreshMeals } = useMeals();
  const [fridgeMeals, setFridgeMeals] = useState<Meal[]>([]);
  const [mealCounts, setMealCounts] = useState({
    fridge: 0,
    freezer: 0,
  });
  
  const [totalServings, setTotalServings] = useState({
    fridge: 0,
    freezer: 0,
  });
  
  // Function to clean up any meals with 0 quantities in both fridge and freezer
  const cleanupEmptyMeals = async () => {
    if (meals.length > 0) {
      let hasEmptyMeals = false;
      
      // Find meals with 0 in both fridge and freezer
      const emptyMeals = meals.filter(meal => 
        (meal.numInFridge || 0) === 0 && (meal.numInFreezer || 0) === 0
      );
      
      // Delete each empty meal
      if (emptyMeals.length > 0) {
        hasEmptyMeals = true;
        console.log(`Found ${emptyMeals.length} empty meals to clean up`);
        
        for (const meal of emptyMeals) {
          await deleteMeal(meal.id);
        }
        
        // Sync with database if any meals were deleted
        if (hasEmptyMeals) {
          await syncWithDatabase();
        }
      }
    }
  };
  
  useEffect(() => {
    // Clean up empty meals when component loads
    cleanupEmptyMeals();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    if (meals.length > 0) {
      // Also clean up empty meals whenever meal data changes
      cleanupEmptyMeals();
      
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
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Welcome Back</Text>
              <Text style={styles.headerSubtitle}>Your meal dashboard</Text>
            </View>
          </View>
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
    paddingHorizontal: 36,
    paddingTop: Platform.OS === "android" ? 30 : 10,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? 40 : 20,
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
