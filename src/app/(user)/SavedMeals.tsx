import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"

interface Meal {
  id: number
  name: string
  details: string
}

export default function SavedHistoryMeals() {
  const [activeTab, setActiveTab] = useState("favorites")

  const meals: Meal[] = [
    { id: 0, name: "Food Name", details: "Details" },
    { id: 1, name: "Food Name", details: "Details" },
    { id: 2, name: "Food Name", details: "Details" },
    { id: 3, name: "Food Name", details: "Details" },
    { id: 4, name: "Food Name", details: "Details" },
    { id: 5, name: "Food Name", details: "Details" },
  ]

  // const handleCreateMeal = (mealId: number) => {
  //   router.push(`/create-meal/${mealId}`)
  // }

  const handleRemove = (mealId: number) => {
    Alert.alert("Remove Meal", "Are you sure you want to remove this meal from favorites?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => console.log("Removing meal:", mealId) },
    ])
  }

  // const handleSaveNewMeal = () => {
  //   router.push("/create-meal")
  // }

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealHeader}>
        <View style={styles.mealContent}>
          <View style={styles.mealImage} />
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{item.name}</Text>
            <Text style={styles.mealDetails}>{item.details}</Text>
          </View>
        </View>
        <Text style={styles.mealNumber}>#{item.id.toString().padStart(2, "0")}</Text>
      </View>

      <View style={styles.mealActions}>
        <TouchableOpacity style={styles.createButton} /*onPress={() => handleCreateMeal(item.id)}*/>
          <Text style={styles.createButtonText}>Create Meal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.removeButton} onPress={() => handleRemove(item.id)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Meals</Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "favorites" && styles.activeTab]}
          onPress={() => setActiveTab("favorites")}
        >
          <Text style={[styles.tabText, activeTab === "favorites" && styles.activeTabText]}>Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text style={[styles.tabText, activeTab === "history" && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
      />

      <TouchableOpacity style={styles.saveButton} /*onPress={handleSaveNewMeal}*/>
        <Text style={styles.saveButtonText}>SAVE NEW MEAL</Text>
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
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4e752d",
  },
  tabText: {
    fontSize: 16,
    color: "#9c9ba6",
  },
  activeTabText: {
    color: "#32343e",
    fontWeight: "500",
  },
  content: {
    paddingHorizontal: 16,
  },
  mealItem: {
    marginBottom: 24,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
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
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#32343e",
    marginBottom: 4,
  },
  mealDetails: {
    fontSize: 14,
    color: "#6b6e82",
  },
  mealNumber: {
    fontSize: 14,
    color: "#6b6e82",
  },
  mealActions: {
    flexDirection: "row",
    gap: 12,
  },
  createButton: {
    flex: 1,
    backgroundColor: "#4e752d",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  removeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#74af44",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#74af44",
    fontSize: 16,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: "#4e752d",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
