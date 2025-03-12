import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"

// Define an interface for the meal item
interface MealItem {
  id: string
  name: string
  image: string
}
// This is just a placeholder for now, you can change this however you see fit

export default function MealGalleryScreen() {
  // Sample data - replace with your actual meal data
  const meals: MealItem[] = [
    { id: "1", name: "Chicken Pasta", image: "https://placeholder.com/300" },
    { id: "2", name: "Vegetable Curry", image: "https://placeholder.com/300" },
    { id: "3", name: "Grilled Salmon", image: "https://placeholder.com/300" },
    { id: "4", name: "Caesar Salad", image: "https://placeholder.com/300" },
    { id: "5", name: "Beef Stir Fry", image: "https://placeholder.com/300" },
    { id: "7", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
    { id: "8", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
    { id: "9", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
    { id: "10", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
    { id: "11", name: "Mushroom Risotto", image: "https://placeholder.com/300" },
  ]

  const renderMealItem = ({ item }: { item: MealItem }) => (
    <TouchableOpacity
      style={styles.mealItem}
      /*onPress={() => handleMealPress(item.id)}*/
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <View style={styles.imagePlaceholder} />
      </View>
      <Text style={styles.mealName} numberOfLines={1}>
        {item.name}
      </Text>
    </TouchableOpacity>
  )

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
      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
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
  listContent: {
    padding: 8,
  },
  row: {
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
