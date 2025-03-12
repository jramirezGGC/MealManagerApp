import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"

interface Meal {
  id: number
  name: string
  type: string
}

export default function MainDashboard() {
  const meals: Meal[] = [
    { id: 1, name: "Meal Name", type: "Breakfast" },
    { id: 2, name: "Meal Name", type: "Breakfast" },
    { id: 3, name: "Meal Name", type: "Breakfast" },
    { id: 4, name: "Meal Name", type: "Breakfast" },
    { id: 5, name: "Meal Name", type: "Breakfast" },
    { id: 6, name: "Meal Name", type: "Breakfast" },
    { id: 7, name: "Meal Name", type: "Breakfast" },
    { id: 8, name: "Meal Name", type: "Breakfast" },
    { id: 9, name: "Meal Name", type: "Breakfast" },
  ]

  const handleMenuPress = (mealId: number) => {
    console.log("Menu pressed for meal:", mealId)
  }

  const handleTakeMeal = (mealId: number) => {
    console.log("Taking meal:", mealId)
  }

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealContent}>
        <View style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <View style={styles.mealTag}>
            <Text style={styles.mealTagText}>{item.type}</Text>
          </View>
        </View>
        <View style={styles.mealActions}>
          <TouchableOpacity onPress={() => handleTakeMeal(item.id)}>
            <Text style={styles.takeMealText}>Take Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuButton} onPress={() => handleMenuPress(item.id)}>
            <Text style={styles.menuButtonText}>⋯</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Main Dashboard</Text>
      </View>

      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => <Text style={styles.sectionTitle}>Fridge Items</Text>}
      />

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} /*onPress={() => router.push("/fridge")}*/>
          <Text style={styles.navIcon}>🗄️</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} /*onPress={() => router.push("/create-meal")}*/>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} /*onPress={() => router.push("/profile")}*/>
          <Text style={styles.navIcon}>👤</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e6f2dc",
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === "android" ? 16 : 0,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#32343e",
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    color: "#9c9ba6",
    marginBottom: 16,
  },
  mealItem: {
    marginBottom: 16,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 12,
  },
  mealContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealImage: {
    width: 80,
    height: 80,
    backgroundColor: "#98a8b8",
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#32343e",
    marginBottom: 8,
  },
  mealTag: {
    backgroundColor: "#FFE5D9",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: "flex-start",
  },
  mealTagText: {
    color: "#FF7622",
    fontSize: 14,
  },
  mealActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  takeMealText: {
    color: "#9c9ba6",
    fontSize: 14,
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 20,
    color: "#6b6e82",
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#74af44",
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  navButton: {
    padding: 8,
  },
  navIcon: {
    fontSize: 24,
    color: "white",
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: "white",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  addButtonText: {
    fontSize: 32,
    color: "#74af44",
  },
})
