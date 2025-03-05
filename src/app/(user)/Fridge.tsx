import { useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"

interface Meal {
  id: number
  name: string
  calories: string
  date: string
}

export default function RefrigeratorScreen() {
  const [activeTab, setActiveTab] = useState("fridge")

  const meals: Meal[] = [
    { id: 1, name: "Meal Name", calories: "kal?", date: "date?" },
    { id: 2, name: "Meal Name", calories: "kal?", date: "date?" },
    { id: 3, name: "Meal Name", calories: "kal?", date: "date?" },
    { id: 4, name: "Meal Name", calories: "kal?", date: "date?" },
    { id: 5, name: "Meal Name", calories: "kal?", date: "date?" },
    { id: 6, name: "Meal Name", calories: "kal?", date: "date?" },
  ]

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={styles.mealItem}>
      <View style={styles.mealContent}>
        <View style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <View style={styles.mealDetails}>
            <Text style={styles.mealDetailText}>{item.calories}</Text>
            <Text style={styles.mealDetailSeparator}>|</Text>
            <Text style={styles.mealDetailText}>{item.date}</Text>
          </View>
        </View>
        <Text style={styles.mealNumber}>#{item.id}</Text>
      </View>
      <TouchableOpacity style={styles.editButton} /*onPress={() => router.push("/edit-meal")}*/>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Refrigerator Management</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "fridge" && styles.activeTab]}
          onPress={() => setActiveTab("fridge")}
        >
          <Text style={[styles.tabText, activeTab === "fridge" && styles.activeTabText]}>Fridge</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "freezer" && styles.activeTab]}
          onPress={() => setActiveTab("freezer")}
        >
          <Text style={[styles.tabText, activeTab === "freezer" && styles.activeTabText]}>Freezer</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={meals}
        renderItem={renderMealItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => <Text style={styles.sectionTitle}>List of Meals:</Text>}
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
    marginLeft: 8,
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
  sectionTitle: {
    fontSize: 16,
    color: "#9c9ba6",
    marginBottom: 16,
  },
  mealItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#caccda",
    paddingBottom: 16,
  },
  mealContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  mealImage: {
    width: 60,
    height: 60,
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
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealDetailText: {
    fontSize: 14,
    color: "#9c9ba6",
  },
  mealDetailSeparator: {
    marginHorizontal: 8,
    color: "#9c9ba6",
  },
  mealNumber: {
    fontSize: 14,
    color: "#9c9ba6",
    marginLeft: 12,
  },
  editButton: {
    backgroundColor: "#74af44",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "flex-end",
  },
  editButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
})