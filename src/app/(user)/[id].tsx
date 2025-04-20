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

import { useState, useRef } from "react"
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context"
import { StyleSheet, Text, View, Pressable, Image, Platform, ScrollView, Animated } from "react-native"
import Colors from "@/src/constants/Colors"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useMeals } from "@/src/context/MealsContext"
import { Images } from "@/src/constants/Images"
import type { Ingredient } from "@/src/types"

export default function MealDetailsScreen() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { meals } = useMeals()
  const [imageError, setImageError] = useState(false)
  const [expandedIngredient, setExpandedIngredient] = useState<Ingredient | null>(null)

  // Animation value for arrow rotation
  const arrowRotation = useRef(new Animated.Value(0)).current

  const mealId = Array.isArray(id) ? id[0] : id
  const meal = meals.find((m) => m.id === mealId)

  if (!meal) {
    return <Text>Meal not found</Text>
  }

  const toggleIngredient = (ingredient: Ingredient) => {
    // Animate the arrow rotation
    Animated.timing(arrowRotation, {
      toValue: expandedIngredient === ingredient ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start()

    if (expandedIngredient === ingredient) {
      setExpandedIngredient(null) // Collapse if already expanded
    } else {
      setExpandedIngredient(ingredient) // Expand the selected ingredient
    }
  }

  // Create interpolated rotation value for the arrow
  const rotateArrow = arrowRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  })

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Pressable style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backIcon}>‹</Text>
              </Pressable>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>Meal Details</Text>
              </View>
            </View>
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              {/* Meal Name Header */}
              <View style={styles.mealNameContainer}>
                <Text style={styles.mealName}>{meal.name}</Text>
              </View>

              {/* Meal Image Section */}
              <View style={styles.imageContainer}>
                <Image
                  source={!imageError && meal.image ? { uri: meal.image } : Images.defaultMeal}
                  style={styles.mealImage}
                  onError={() => setImageError(true)}
                  onLoadStart={() => setImageError(false)}
                />
              </View>

              {/* Inventory Summary Section */}
              <View style={styles.inventorySummary}>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalLabel}>Total Meals in Inventory</Text>
                  <Text style={styles.totalValue}>
                    {Number(meal.numInFridge || 0) + Number(meal.numInFreezer || 0)}
                  </Text>
                </View>

                <View style={styles.servingsContainer}>
                  <View style={styles.servingItem}>
                    <Text style={styles.servingLabel}>Fridge</Text>
                    <Text style={styles.servingValue}>{meal.numInFridge || 0}</Text>
                  </View>

                  <View style={styles.servingDivider} />

                  <View style={styles.servingItem}>
                    <Text style={styles.servingLabel}>Freezer</Text>
                    <Text style={styles.servingValue}>{meal.numInFreezer || 0}</Text>
                  </View>
                </View>
              </View>

              {/* Meal Information Section */}
              <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                  <View style={styles.card}>
                    <Text style={styles.label}>Description</Text>
                    <Text style={styles.descriptionText}>{meal.description}</Text>
                  </View>
                </View>

                <View style={styles.infoItem}>
                  <View style={styles.card}>
                    <Text style={styles.label}>Ingredients</Text>
                    <View style={styles.ingredientsContainer}>
                      {meal.ingredients && meal.ingredients.length > 0 ? (
                        meal.ingredients.map((ingredient, index) => (
                          <View key={index} style={styles.ingredientBox}>
                            <Pressable
                              onPress={() => toggleIngredient(ingredient)}
                              style={({ pressed }) => [styles.ingredientPressable, { opacity: pressed ? 0.7 : 1 }]}
                            >
                              <View style={styles.ingredientHeader}>
                                <Text style={styles.ingredientText}>{ingredient.name}</Text>
                                <View style={styles.arrowCircle}>
                                  <Animated.Text
                                    style={[
                                      styles.arrowIcon,
                                      {
                                        transform: [
                                          { rotate: expandedIngredient === ingredient ? rotateArrow : "0deg" },
                                        ],
                                      },
                                    ]}
                                  >
                                    ▼
                                  </Animated.Text>
                                </View>
                              </View>
                            </Pressable>
                            {expandedIngredient === ingredient && (
                              <View style={styles.ingredientDetailsContainer}>
                                <Text style={styles.ingredientDetails}>Amount: {ingredient.amount || "N/A"}</Text>
                                <Text style={styles.ingredientDetails}>Calories: {ingredient.calories || "N/A"}</Text>
                              </View>
                            )}
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noIngredientsText}>No ingredients added</Text>
                      )}
                    </View>
                  </View>
                </View>

                {/* Edit Button */}
                <View style={styles.buttonContainer}>
                  <Pressable
                    style={styles.editButton}
                    onPress={() =>
                      router.push({
                        pathname: "/EditMeal",
                        params: { id: mealId },
                      })
                    }
                  >
                    <Text style={styles.editText}>Edit Meal</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 20 : 10,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextContainer: {
    flex: 1,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
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
  mealNameContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  mealName: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  mealImage: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 4,
    borderColor: Colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  infoItem: {
    marginBottom: 16,
  },
  label: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.primary,
    marginBottom: 10,
    paddingTop: 16,
    textAlign: "center",
  },
  value: {
    fontSize: 16,
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  inventorySummary: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  totalContainer: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 8,
  },
  totalValue: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.white,
  },
  servingsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  servingItem: {
    flex: 1,
    alignItems: "center",
  },
  servingLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  servingValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
  },
  servingDivider: {
    width: 1,
    backgroundColor: Colors.textTertiary,
    opacity: 0.3,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  editButton: {
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
  editText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ingredientText: {
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: "bold",
    flex: 1,
  },
  ingredientPressable: {
    borderRadius: 8,
  },
  ingredientDetailsContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  ingredientDetails: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 5,
  },
  ingredientsContainer: {
    marginTop: 8,
  },
  ingredientBox: {
    backgroundColor: Colors.background,
    padding: 15,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ingredientHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  arrowCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcon: {
    color: Colors.white,
    fontSize: 12,
    textAlign: "center",
  },
  descriptionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
    textAlign: "center",
    marginVertical: 10,
  },
  noIngredientsText: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginVertical: 10,
  },
})
