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

import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, TextInput } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router, useLocalSearchParams } from "expo-router"
import Colors from '@/src/constants/Colors';

export default function RecreateMealScreen() {
  const { id } = useLocalSearchParams()
  const [quantity, setQuantity] = useState("1")

  // Mock data - replace with actual data fetching logic
  const meal = {
    id: id,
    name: "Chicken Pasta",
    description: "A delicious pasta dish with grilled chicken and creamy sauce.",
    ingredients: [
      "400g pasta",
      "2 chicken breasts",
      "200ml cream",
      "1 onion",
      "2 cloves of garlic",
      "Salt and pepper to taste",
    ],
    image: "https://placeholder.com/400",
  }

  const handleQuantityChange = (value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      setQuantity(value)
    } else if (value === "") {
      setQuantity("")
    }
  }

  const handleRecreateMeal = () => {
    console.log(`Recreating ${quantity} ${meal.name}(s)`)
    // Add your logic here to handle meal recreation
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Recreate Meal</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Meal Image */}
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder} />
        </View>

        {/* Meal Name */}
        <Text style={styles.mealName}>{meal.name}</Text>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{meal.description}</Text>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
          {meal.ingredients.map((ingredient, index) => (
            <Text key={index} style={styles.ingredient}>
              • {ingredient}
            </Text>
          ))}
        </View>

        {/* Quantity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Number of Meals</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange((Number.parseInt(quantity) - 1).toString())}
              disabled={quantity === "1"}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.quantityInput}
              value={quantity}
              onChangeText={handleQuantityChange}
              keyboardType="number-pad"
            />
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleQuantityChange((Number.parseInt(quantity) + 1).toString())}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Recreate Button */}
      <TouchableOpacity style={styles.recreateButton} onPress={handleRecreateMeal}>
        <Text style={styles.recreateButtonText}>RECREATE MEAL</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: Colors.imagePlaceholder,
  },
  mealName: {
    fontSize: 24,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  ingredient: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: "600",
  },
  quantityInput: {
    width: 60,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginHorizontal: 16,
    textAlign: "center",
    fontSize: 18,
    color: Colors.textPrimary,
  },
  recreateButton: {
    backgroundColor: Colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  recreateButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})
