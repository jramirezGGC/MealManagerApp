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

import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform, Image } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router, useLocalSearchParams } from "expo-router"
import Colors from "@/src/constants/Colors"
import type { Meal } from "@/src/types"
import { useMeals } from "@/src/context/MealsContext"
import React from "react"

// Match the tab bar height from _layout.tsx
const TAB_BAR_HEIGHT = 65;

export default function RefrigeratorScreen() {
  const params = useLocalSearchParams()
  const [activeTab, setActiveTab] = useState("fridge")
  const [recentMealId, setRecentMealId] = useState<string | null>(null)
  const [showRecentHighlight, setShowRecentHighlight] = useState(false)
  const [displayMeals, setDisplayMeals] = useState<Meal[]>([])
  
  // Get meals from context
  const { meals, loading } = useMeals()

  // Calculate total servings for a location
  const calculateTotalServings = (tab: string) => {
    if (tab === "fridge") {
      return meals.reduce((total, meal) => total + (meal.numInFridge || 0), 0);
    } else {
      return meals.reduce((total, meal) => total + (meal.numInFreezer || 0), 0);
    }
  }

  // Filter meals based on active tab
  const filterMeals = (tab: string) => {
    if (tab === "fridge") {
      return meals.filter(meal => meal.numInFridge > 0);
    } else {
      return meals.filter(meal => meal.numInFreezer > 0);
    }
  }

  const switchTab = (tab: string) => {
    setActiveTab(tab)
    setDisplayMeals(filterMeals(tab))
  }

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={[styles.mealItem, showRecentHighlight && item.id === recentMealId && styles.recentMealItem]}>
      <View style={styles.mealContent}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.mealImage} />
        ) : (
          <View style={styles.mealImage} />
        )}
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <View style={styles.mealDetails}>
            <Text style={styles.mealDetailText}>
              {activeTab === "fridge" ? `${item.numInFridge} servings` : `${item.numInFreezer} servings`}
            </Text>
            {showRecentHighlight && item.id === recentMealId && (
              <>
                <Text style={styles.mealDetailSeparator}>|</Text>
                <Text style={styles.newMealTag}>New</Text>
              </>
            )}
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          router.push({
            pathname: "/EditMeal",
            params: { id: item.id },
          })
        }
      >
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  )

  useEffect(() => {
    // Apply filters based on initial tab
    setDisplayMeals(filterMeals(activeTab))
    
    // Check if we have a recent meal to highlight
    if (params.recentMealId && params.showRecent === "true") {
      setRecentMealId(params.recentMealId as string)
      setShowRecentHighlight(true)

      // Switch to the tab where the meal was added
      if (params.storageLocation) {
        const tabToShow = params.storageLocation as string
        setActiveTab(tabToShow)
        setDisplayMeals(filterMeals(tabToShow))
      }

      // Clear the highlight after 3 seconds
      setTimeout(() => {
        setShowRecentHighlight(false)
      }, 3000)
    }
  }, [params.recentMealId, params.showRecent, params.storageLocation, meals])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section with Dynamic Title */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{activeTab === "fridge" ? "Fridge" : "Freezer"}</Text>
        </View>
        <Text style={styles.headerSubtitle}>Manage your meals</Text>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Improved Tab Container */}
        <View style={styles.tabsOuterContainer}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "fridge" && styles.activeTab]}
              onPress={() => switchTab("fridge")}
            >
              <Text style={[styles.tabText, activeTab === "fridge" && styles.activeTabText]}>Fridge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "freezer" && styles.activeTab]}
              onPress={() => switchTab("freezer")}
            >
              <Text style={[styles.tabText, activeTab === "freezer" && styles.activeTabText]}>Freezer</Text>
            </TouchableOpacity>
          </View>

          {/* Total Meals Count */}
          <View style={styles.totalMealsContainer}>
            <Text style={styles.totalMealsValue}>{calculateTotalServings(activeTab)}</Text>
            <Text style={styles.totalMealsLabel}>Total Servings in {activeTab === "fridge" ? "Fridge" : "Freezer"}</Text>
          </View>
        </View>

        {/* Meal List */}
        <FlatList
          data={displayMeals}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            ...styles.mealListContent,
            paddingBottom: TAB_BAR_HEIGHT + 20, // more room for scrolling
          }}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No meals found in {activeTab}</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 40 : 20,
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
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingBottom: TAB_BAR_HEIGHT, // Match the tab bar height
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  tabsOuterContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: "600",
  },
  totalMealsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  totalMealsValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  totalMealsLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
    textAlign: "center",
  },
  mealListContent: {
    paddingHorizontal: 24,
    paddingBottom: TAB_BAR_HEIGHT + 20, // Ensures scroll past button
  },
  mealItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  recentMealItem: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(0, 128, 0, 0.05)",
  },
  mealContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mealImage: {
    width: 60,
    height: 60,
    backgroundColor: Colors.imagePlaceholder,
    borderRadius: 8,
    overflow: "hidden"
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  mealDetailSeparator: {
    marginHorizontal: 8,
    color: Colors.textTertiary,
  },
  newMealTag: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "flex-end",
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textTertiary,
    textAlign: "center",
  },
})
