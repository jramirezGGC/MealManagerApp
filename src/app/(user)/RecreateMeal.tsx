import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform, TextInput } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router, useLocalSearchParams } from "expo-router"

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
    marginLeft: 12,
    color: "#32343e",
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
    backgroundColor: "#98a8b8",
  },
  mealName: {
    fontSize: 24,
    fontWeight: "600",
    color: "#32343e",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#32343e",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#6b6e82",
    lineHeight: 24,
  },
  ingredient: {
    fontSize: 16,
    color: "#6b6e82",
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
    backgroundColor: "#74af44",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 24,
    color: "white",
    fontWeight: "600",
  },
  quantityInput: {
    width: 60,
    height: 40,
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 16,
    textAlign: "center",
    fontSize: 18,
    color: "#32343e",
  },
  recreateButton: {
    backgroundColor: "#4e752d",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  recreateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
