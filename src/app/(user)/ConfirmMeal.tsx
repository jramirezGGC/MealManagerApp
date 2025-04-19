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

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  TextInput,
  ScrollView,
  Switch,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { router, useLocalSearchParams } from "expo-router"
import Colors from "@/src/constants/Colors"
import AsyncStorage from "@react-native-async-storage/async-storage"

export default function ConfirmMealScreen() {
  const params = useLocalSearchParams()
  const [mealData, setMealData] = useState<any>(null)
  const [fridgeMeals, setFridgeMeals] = useState("")
  const [freezerMeals, setFreezerMeals] = useState("")
  const [saveMeal, setSaveMeal] = useState(true)
  const [loading, setLoading] = useState(false)

  // Calculate total meals
  const totalMeals = (Number.parseInt(fridgeMeals) || 0) + (Number.parseInt(freezerMeals) || 0)

  useEffect(() => {
    // Parse the meal data from params
    if (params.mealData) {
      try {
        const parsedData = JSON.parse(params.mealData as string)
        // Only update if different to prevent infinite loop
        if (JSON.stringify(parsedData) !== JSON.stringify(mealData)) {
          setMealData(parsedData)
        }
      } catch (error) {
        console.error("Error parsing meal data:", error)
      }
    }
  }, [params.mealData, mealData])

  // Function to save meal to AsyncStorage
  const saveMealToStorage = async (meal: any) => {
    try {
      // First, get existing meals from storage
      const storedMealsJson = await AsyncStorage.getItem('dummyMeals')
      let storedMeals = storedMealsJson ? JSON.parse(storedMealsJson) : []
      
      // Check if meal already exists
      const existingIndex = storedMeals.findIndex((m: any) => m.id === meal.id)
      
      if (existingIndex >= 0) {
        // Update existing meal
        storedMeals[existingIndex] = meal
      } else {
        // Add new meal
        storedMeals.push(meal)
      }
      
      // Save back to storage
      await AsyncStorage.setItem('dummyMeals', JSON.stringify(storedMeals))
      console.log('Meal saved to storage successfully')
    } catch (error) {
      console.error('Error saving meal to storage:', error)
    }
  }

  const handleConfirmMeal = async () => {
    if (totalMeals <= 0) {
      alert("Please add at least one meal to your inventory")
      return
    }

    setLoading(true)

    // Create dummy meal data for testing
    const dummyMeal = {
      id: mealData?.id || Math.floor(Math.random() * 10000).toString(),
      name: mealData?.name || "Dummy Meal",
      description: mealData?.description || "This is a dummy meal for testing",
      ingredients: mealData?.ingredients || ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
      numInFridge: Number.parseInt(fridgeMeals) || 0,
      numInFreezer: Number.parseInt(freezerMeals) || 0,
      date: new Date().toISOString().split('T')[0],
      calories: "350 cal",
      createdAt: new Date().toISOString(),
    }

    console.log("Dummy meal created:", dummyMeal)
    
    try {
      // Save meal to AsyncStorage
      await saveMealToStorage(dummyMeal)
      
      // Simulate a short delay to mimic network request
      setTimeout(() => {
        setLoading(false)
        
        // Show success message
        alert(
          `Success! Added ${fridgeMeals || "0"} meals to fridge and ${freezerMeals || "0"} meals to freezer.${
            saveMeal ? " Meal saved to your collection." : ""
          }`
        )

        // Navigate to Refrigerator screen with the dummy meal data
        router.push({
          pathname: "/(user)/Fridge",
          params: {
            recentMealId: dummyMeal.id,
            showRecent: "true",
            storageLocation: Number.parseInt(fridgeMeals) > 0 ? "fridge" : "freezer",
          }
        })
      }, 1500)
    } catch (error) {
      console.error("Error during meal confirmation:", error)
      setLoading(false)
      alert("There was an error saving your meal. Please try again.")
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Confirm Meal</Text>
            <Text style={styles.headerSubtitle}>Add this meal to your inventory</Text>
        </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Meal Information */}
          <View style={styles.mealInfoContainer}>
            <View style={styles.mealImageContainer}>
              <Text style={styles.mealImagePlaceholder}>🍲</Text>
            </View>
            <View style={styles.mealDetails}>
              <Text style={styles.mealName}>{mealData?.name || "Meal Name"}</Text>
              <Text style={styles.mealDescription} numberOfLines={2}>
                {mealData?.description || "No description available"}
              </Text>
            </View>
          </View>

          {/* Stats Container */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{mealData?.ingredients?.length || 0}</Text>
              <Text style={styles.statLabel}>Ingredients</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{totalMeals}</Text>
              <Text style={styles.statLabel}>Total Servings</Text>
            </View>
          </View>

          {/* Input Fields */}
          <View style={styles.inputsContainer}>
            <Text style={styles.sectionTitle}>Storage Options</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Fridge Servings</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={fridgeMeals}
                  onChangeText={setFridgeMeals}
                  maxLength={2}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Freezer Servings</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  keyboardType="numeric"
                  value={freezerMeals}
                  onChangeText={setFreezerMeals}
                  maxLength={2}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>

            {/* Save Meal Option */}
            <View style={styles.saveOptionContainer}>
              <Text style={styles.saveOptionText}>Save this meal to your collection</Text>
              <Switch
                value={saveMeal}
                onValueChange={setSaveMeal}
                trackColor={{ false: Colors.divider, true: Colors.primary }}
                thumbColor={saveMeal ? Colors.white : "#f4f3f4"}
              />
            </View>

            {/* Save Meal Info */}
            {saveMeal && (
              <Text style={styles.saveInfo}>
                This meal will be saved to your collection for future use. You can find it in your Saved Meals.
              </Text>
            )}
          </View>

          {/* Ingredients List */}
          <View style={styles.ingredientsContainer}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {mealData?.ingredients && mealData.ingredients.length > 0 ? (
              mealData.ingredients.map((ingredient: string, index: number) => (
                <View key={index} style={styles.ingredientItem}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.ingredientText}>{ingredient}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noIngredientsText}>No ingredients listed</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Confirm Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.confirmButton, loading && styles.confirmButtonDisabled]}
          onPress={handleConfirmMeal}
          disabled={loading}
        >
          <Text style={styles.confirmButtonText}>{loading ? "Processing..." : "Confirm Meal"}</Text>
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
    paddingHorizontal: 12,
    paddingTop: Platform.OS === "android" ? 40 : 20, // Increased from 16/0 to 40/20
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.backButtonColor,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  backIcon: {
    fontSize: 28, // Reduced from 32 to 28
    color: Colors.background,
    textAlign: "center",
    lineHeight: 32, // Added line height to center the text vertically
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginLeft: 0, // Added margin to separate from back button
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingBottom: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  mealInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  mealImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  mealImagePlaceholder: {
    fontSize: 40,
  },
  mealDetails: {
    flex: 1,
  },
  mealName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mealDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
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
  statDivider: {
    width: 1,
    backgroundColor: Colors.textTertiary,
    opacity: 0.3,
  },
  inputsContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "#f9faf7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  input: {
    padding: Platform.OS === "ios" ? 16 : 12,
    fontSize: 16,
    color: Colors.textPrimary,
  },
  saveOptionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
    paddingVertical: 8,
  },
  saveOptionText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  saveInfo: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    fontStyle: "italic",
  },
  ingredientsContainer: {
    paddingHorizontal: 24,
  },
  ingredientItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.primary,
    marginRight: 8,
    lineHeight: 24,
  },
  ingredientText: {
    fontSize: 16,
    color: Colors.textPrimary,
    flex: 1,
  },
  noIngredientsText: {
    fontSize: 16,
    color: Colors.textTertiary,
    fontStyle: "italic",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  confirmButton: {
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
  confirmButtonDisabled: {
    opacity: 0.7,
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})