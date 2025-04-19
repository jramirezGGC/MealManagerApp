import React, { useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, ActivityIndicator, Image, ScrollView, Alert, FlatList } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router, useFocusEffect } from "expo-router"
import Colors from "@/src/constants/Colors"
import { useSavedMeals } from "@/src/context/MealsContext"
import { Meal } from "@/src/types"

export default function SavedMealsScreen() {
  const { savedMeals, loading, error, fetchSavedMeals, deleteMeal } = useSavedMeals()

  useFocusEffect(
    React.useCallback(() => {
      fetchSavedMeals()
    }, [])
  )

  const handleRemove = (mealId: string) => {
    Alert.alert(
      "Remove Meal",
      "Are you sure you want to remove this meal from favorites?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMeal(mealId)
              fetchSavedMeals()
              Alert.alert("Success", "Meal has been removed from favorites")
            } catch (error) {
              console.error("Error removing meal:", error)
              Alert.alert("Error", "Failed to remove meal. Please try again.")
            }
          },
        },
      ]
    )
  }

  const handleCreateMeal = (savedMeal: Meal) => {
    router.push({
      pathname: "/(user)/CreateMeal",
      params: {
        savedMealId: savedMeal.id,
      },
    })
  }

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealContent}>
        <View style={styles.mealImageContainer}>
          {item.image ? (
            <Image source={{ uri: item.image }} style={styles.mealImage} />
          ) : (
            <Text style={styles.mealImagePlaceholder}>🍲</Text>
          )}
        </View>
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <Text style={styles.mealDescription} numberOfLines={2}>
            {item.description || "No description available"}
          </Text>
          <Text style={styles.ingredientsCount}>
            {item.ingredients ? `${item.ingredients.length} ingredients` : "No ingredients"}
            {item.calories ? ` • ${item.calories} calories` : ""}
          </Text>
        </View>
      </View>

      <View style={styles.mealActions}>
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => handleCreateMeal(item)}
        >
          <Text style={styles.createButtonText}>Create Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.removeButton} 
          onPress={() => handleRemove(item.id)}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => fetchSavedMeals()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Saved Meals</Text>
            <Text style={styles.headerSubtitle}>Your favorite meal recipes</Text>
          </View>
        </View>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {savedMeals.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don't have any saved meals yet.</Text>
            <Text style={styles.emptySubtext}>Create a meal to see it here!</Text>
          </View>
        ) : (
          <FlatList
            data={savedMeals}
            renderItem={renderMealItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Create New Meal Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.saveButton} 
          onPress={() => router.push("/(user)/CreateMeal")}
        >
          <Text style={styles.saveButtonText}>Create New Meal</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backIcon: {
    fontSize: 28,
    color: Colors.white,
    textAlign: "center",
    lineHeight: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
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
    paddingBottom: 100, // Extra space for the button
    borderBottomLeftRadius: 30, // 👈 Added
    borderBottomRightRadius: 30, // 👈 Added
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.white,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  mealItem: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mealContent: {
    flexDirection: "row",
    marginBottom: 16,
  },
  mealImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.imagePlaceholder,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: "hidden",
  },
  mealImage: {
    width: 80,
    height: 80,
    resizeMode: "cover",
  },
  mealImagePlaceholder: {
    fontSize: 32,
  },
  mealInfo: {
    flex: 1,
    justifyContent: "center",
  },
  mealName: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  ingredientsCount: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
  },
  mealActions: {
    flexDirection: "row",
    gap: 12,
  },
  createButton: {
    flex: 1,
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  createButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "500",
  },
  removeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.secondary,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  removeButtonText: {
    color: Colors.secondary,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    bottom: 50,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})
