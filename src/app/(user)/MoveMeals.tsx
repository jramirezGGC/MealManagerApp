import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import Colors from "@/src/constants/Colors"
import type { Meal } from "@/src/types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FIREBASE_DB } from "@/src/lib/firebaseConfig"
import { doc, getDoc, updateDoc } from "firebase/firestore"

let mealsArr: Meal[] = []
let meals: Meal[] = []

async function loadStuff(storageUnit: string) {
  let householdID
  try {
    householdID = await AsyncStorage.getItem("householdID")
  } catch (error) {
    console.error("Async Storage could not get householdID", error)
  }
  const userDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${storageUnit}`)
  const snapshot = await getDoc(userDoc)
  if (snapshot.exists()) {
    const docData = snapshot.data()
    const dict = { ...docData.meals }
    for (const key in dict) {
      if (dict.hasOwnProperty(key)) {
        if (!mealsArr.find((obj) => obj.id == key)) {
          mealsArr.push({
            id: key,
            name: dict[key].name,
            description: dict[key].description,
            image: require("../../../assets/images/dummyMealImages/chickenandrice.jpg"),
            ingredients: dict[key].ingredients,
            ...(storageUnit == "fridge1" ? { numInFridge: dict[key].servings } : { numInFreezer: dict[key].servings }),
          } as Meal)
        } else {
          const meal: any = mealsArr.find((obj) => obj.id == key)
          storageUnit == "fridge1" ? (meal.numInFridge = dict[key].servings) : (meal.numInFreezer = dict[key].servings)
        }
      }
    }
  }
}

export default function MoveMealsScreen() {
  const [activeTab, setActiveTab] = useState("fridge")
  const [loading, setLoading] = useState(true)
  const [selectedMeals, setSelectedMeals] = useState<string[]>([])
  const [displayMeals, setDisplayMeals] = useState<Meal[]>([])

  // Calculate total servings for the current tab
  const calculateTotalServings = () => {
    if (activeTab === "fridge") {
      return displayMeals.reduce((total, meal) => total + (meal.numInFridge || 0), 0);
    } else {
      return displayMeals.reduce((total, meal) => total + (meal.numInFreezer || 0), 0);
    }
  }

  function switchTab(tab: string) {
    meals = []
    for (const key in mealsArr) {
      if (tab == "fridge") {
        if (!(typeof mealsArr[key].numInFridge === undefined)) {
          if (mealsArr[key].numInFridge != undefined) {
            meals.push(mealsArr[key])
          }
        }
      } else if (tab == "freezer") {
        if (!(typeof mealsArr[key].numInFreezer === undefined)) {
          if (mealsArr[key].numInFreezer != undefined) {
            meals.push(mealsArr[key])
          }
        }
      }
    }
    setDisplayMeals(meals)
    setActiveTab(tab)
    setSelectedMeals([])
  }

  const toggleMealSelection = (mealId: string) => {
    setSelectedMeals((prevSelected) =>
      prevSelected.includes(mealId) ? prevSelected.filter((id) => id !== mealId) : [...prevSelected, mealId],
    )
  }

  const handleMoveMeals = async () => {
    if (selectedMeals.length === 0) {
      Alert.alert("No Meals Selected", "Please select at least one meal to move")
      return
    }

    try {
      const householdID = await AsyncStorage.getItem("householdID")

      // Get the source and destination storage units
      const sourceUnit = activeTab === "fridge" ? "fridge1" : "freezer1"
      const destUnit = activeTab === "fridge" ? "freezer1" : "fridge1"

      // Get references to both documents
      const sourceDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${sourceUnit}`)
      const destDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${destUnit}`)

      // Get current data
      const sourceSnapshot = await getDoc(sourceDoc)
      const destSnapshot = await getDoc(destDoc)

      if (sourceSnapshot.exists() && destSnapshot.exists()) {
        const sourceData = sourceSnapshot.data()
        const destData = destSnapshot.data()

        // Create copies of the meals objects
        const sourceMeals = { ...sourceData.meals }
        const destMeals = { ...destData.meals }

        // Process each selected meal
        for (const mealId of selectedMeals) {
          if (sourceMeals[mealId]) {
            // Add or update the meal in the destination
            if (destMeals[mealId]) {
              // If meal already exists in destination, add the servings
              destMeals[mealId] = {
                ...destMeals[mealId],
                servings: (destMeals[mealId].servings || 0) + (sourceMeals[mealId].servings || 0),
              }
            } else {
              // If meal doesn't exist in destination, copy it
              destMeals[mealId] = { ...sourceMeals[mealId] }
            }

            // Remove the meal from the source
            delete sourceMeals[mealId]
          }
        }

        // Update both documents
        await updateDoc(sourceDoc, { meals: sourceMeals })
        await updateDoc(destDoc, { meals: destMeals })

        // Show success message
        Alert.alert(
          "Meals Moved",
          `Successfully moved ${selectedMeals.length} meals from ${activeTab} to ${activeTab === "fridge" ? "freezer" : "fridge"}.`,
          [
            {
              text: "OK",
              onPress: async () => {
                // Reset and reload data
                mealsArr = []
                await loadStuff("fridge1")
                await loadStuff("freezer1")
                switchTab(activeTab)
              },
            },
          ],
        )
      }
    } catch (error) {
      console.error("Error moving meals:", error)
      Alert.alert("Error", "Failed to move meals. Please try again.")
    }
  }

  const renderMealItem = ({ item }: { item: Meal }) => {
    const isSelected = selectedMeals.includes(item.id.toString())

    return (
      <TouchableOpacity
        style={[styles.mealItem, isSelected && styles.selectedMealItem]}
        onPress={() => toggleMealSelection(item.id.toString())}
      >
        <View style={styles.mealContent}>
          <View style={styles.mealImage} />
          <View style={styles.mealInfo}>
            <Text style={styles.mealName}>{item.name}</Text>
            <View style={styles.mealDetails}>
              <Text style={styles.mealDetailText}>
                {activeTab === "fridge"
                  ? `${item.numInFridge} servings in Fridge`
                  : `${item.numInFreezer} servings in Freezer`}
              </Text>
            </View>
          </View>
          <View style={styles.checkboxContainer}>
            <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
              {isSelected && <Text style={styles.checkmark}>✓</Text>}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        mealsArr = [] // Reset the array before loading
        await loadStuff("fridge1")
        await loadStuff("freezer1")
        switchTab("fridge") // Default to fridge tab
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section with Dynamic Title */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Move Meals</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Select meals to move from {activeTab} to {activeTab === "fridge" ? "freezer" : "fridge"}
        </Text>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Improved Tab Container */}
        <View style={styles.tabsOuterContainer}>
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "fridge" && styles.activeTab]}
              onPress={() => switchTab("fridge")}
            >
              <Text style={[styles.tabText, activeTab === "fridge" && styles.activeTabText]}>Fridge</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "freezer" && styles.activeTab]}
              onPress={() => switchTab("freezer")}
            >
              <Text style={[styles.tabText, activeTab === "freezer" && styles.activeTabText]}>Freezer</Text>
            </TouchableOpacity>
          </View>

          {/* Total Meals and Selection Count */}
          <View style={styles.totalMealsContainer}>
            <Text style={styles.totalMealsValue}>{calculateTotalServings()}</Text>
            <Text style={styles.totalMealsLabel}>Total Servings in {activeTab === "fridge" ? "Fridge" : "Freezer"}</Text>
            {selectedMeals.length > 0 && (
              <Text style={styles.selectionText}>{selectedMeals.length} meals selected</Text>
            )}
          </View>
        </View>

        {/* Meal List */}
        <FlatList
          data={displayMeals}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.mealListContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No meals found in {activeTab}</Text>
            </View>
          )}
        />

        {/* Move Button */}
        {selectedMeals.length > 0 && (
          <TouchableOpacity style={styles.moveButton} onPress={handleMoveMeals}>
            <Text style={styles.moveButtonText}>Move to {activeTab === "fridge" ? "Freezer" : "Fridge"}</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: Colors.textPrimary,
  },
  headerContainer: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
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
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingBottom: 80, // Add padding for bottom nav
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  tabsOuterContainer: {
    marginHorizontal: 24,
    marginBottom: 24,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  activeTabText: {
    color: Colors.white,
    fontWeight: "600",
  },
  totalMealsContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  totalMealsValue: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  totalMealsLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  mealListContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Add padding to account for bottom nav
  },
  mealItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 12,
    padding: 16,
    backgroundColor: Colors.background,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedMealItem: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(0, 128, 0, 0.05)",
  },
  mealContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealImage: {
    width: 60,
    height: 60,
    backgroundColor: Colors.imagePlaceholder,
    borderRadius: 8,
  },
  mealInfo: {
    flex: 1,
    marginLeft: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealDetailText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  checkboxContainer: {
    marginLeft: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
  },
  checkmark: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textTertiary,
    textAlign: "center",
  },
  moveButton: {
    position: "absolute",
    bottom: 24,
    left: 24,
    right: 24,
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  moveButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})
