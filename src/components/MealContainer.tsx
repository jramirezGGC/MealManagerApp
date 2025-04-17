import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, FlatList, type ViewStyle } from "react-native"
import Colors from "@/src/constants/Colors"
import type { Meal } from "../types"

interface MealContainerProp {
  meals: Meal[]
  ListHeaderComponent?: React.ReactElement | null
  contentContainerStyle?: ViewStyle
}

// Sample meal data
/* const meals2: Meal[] = [
  { id: 1, name: "Chicken Pasta", type: "Lunch" },
  { id: 2, name: "Avocado Toast", type: "Breakfast" },
  { id: 3, name: "Vegetable Stir Fry", type: "Dinner" },
  { id: 4, name: "Greek Yogurt", type: "Breakfast" },
  { id: 5, name: "Salmon with Rice", type: "Dinner" },
  { id: 6, name: "Caesar Salad", type: "Lunch" },
  { id: 7, name: "Fruit Smoothie", type: "Breakfast" },
  { id: 8, name: "Beef Stew", type: "Dinner" },
  { id: 9, name: "Quinoa Bowl", type: "Lunch" },
]; */

function MealContainer({ meals, ListHeaderComponent, contentContainerStyle }: MealContainerProp) {
  const handleMenuPress = (mealId: string) => {
    console.log("Menu pressed for meal:", mealId)
  }

  const handleTakeMeal = (mealId: string) => {
    console.log("Taking meal:", mealId)
  }

  // const getMealTypeColor = (type: string) => {
  //   switch (type) {
  //     case "Breakfast":
  //       return { bg: "#FFE5D9", text: "#FF7622" }
  //     case "Lunch":
  //       return { bg: "#E0F7FA", text: "#0097A7" }
  //     case "Dinner":
  //       return { bg: "#E8F5E9", text: "#388E3C" }
  //     default:
  //       return { bg: "#F5F5F5", text: "#757575" }
  //   }
  // }

  const renderMealItem = ({ item }: { item: Meal }) => {
    //const typeColors = getMealTypeColor(item.description)

    return (
      <View style={styles.mealItem}>
        <View style={styles.mealContent}>
          <View style={styles.mealImage} />
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{item.name}</Text>
            <View style={[styles.mealTag, { /* backgroundColor: typeColors.bg */ }]}>
              <Text style={[styles.mealTagText, { /* color: typeColors.text */ }]}>{}</Text>
            </View>
          </View>
        </View>
        <View style={styles.mealActions}>
          <TouchableOpacity style={styles.takeMealButton} onPress={() => handleTakeMeal(item.id)}>
            <Text style={styles.takeMealText}>Take Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => handleMenuPress(item.id)}>
            <Text style={styles.menuButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  // Create a combined header that includes both the passed ListHeaderComponent and our section title
  const combinedHeader = () => (
    <>
      {ListHeaderComponent}
      <Text style={styles.sectionTitle}>Fridge Meals For Today</Text>
    </>
  )

  return (
    <FlatList
      data={meals}
      renderItem={renderMealItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={[styles.listContent, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={combinedHeader()}
    />
  )
}

export default MealContainer

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Extra padding for bottom nav
  },
  mealItem: {
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  mealContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mealImage: {
    width: 70,
    height: 70,
    backgroundColor: Colors.imagePlaceholder,
    borderRadius: 12,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 16,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  mealTag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  mealTagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  mealActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  takeMealButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  takeMealText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
  },
  menuButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  menuButtonText: {
    fontSize: 18,
    color: Colors.textSecondary,
  },
})
