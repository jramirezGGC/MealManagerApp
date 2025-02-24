import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"

export default function MealGalleryScreen() {
  // Sample data - replace with your actual meal data
  const meals = [
    { id: 1, name: "Chicken Pasta", image: "https://placeholder.com/300" },
    { id: 2, name: "Vegetable Curry", image: "https://placeholder.com/300" },
    { id: 3, name: "Grilled Salmon", image: "https://placeholder.com/300" },
    { id: 4, name: "Caesar Salad", image: "https://placeholder.com/300" },
    { id: 5, name: "Beef Stir Fry", image: "https://placeholder.com/300" },
    { id: 6, name: "Mushroom Risotto", image: "https://placeholder.com/300" },
  ]

//   const handleMealPress = (mealId: number) => {
//     router.push(`/meal/${mealId}`)
//   }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meal Gallery</Text>
      </View>

      {/* Gallery Grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.galleryGrid}>
          {meals.map((meal) => (
            <TouchableOpacity
              key={meal.id}
              style={styles.mealItem}
              /*onPress={() => handleMealPress(meal.id)}*/
              activeOpacity={0.7}
            >
              <View style={styles.imageContainer}>
                <View style={styles.imagePlaceholder} />
              </View>
              <Text style={styles.mealName} numberOfLines={1}>
                {meal.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
    justifyContent: "space-between",
  },
  mealItem: {
    width: "48%", // Slightly less than 50% to allow for spacing
    marginBottom: 16,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 1, // Makes it square
    marginBottom: 8,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#98a8b8",
    borderRadius: 16,
  },
  mealName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#32343e",
    textAlign: "center",
    paddingHorizontal: 4,
  },
})
