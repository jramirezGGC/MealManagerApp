import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import Colors from "@/src/constants/Colors"
import type { Meal } from "@/src/types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FIREBASE_DB } from "@/src/lib/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"

let mealsArr: Meal[] = []
let meals: Meal[] = []

// async function loadStuff(storageUnit: string) {
//   let householdID
//   try {
//     householdID = await AsyncStorage.getItem("householdID")
//   } catch (error) {
//     console.error("Async Storage could not get householdID", error)
//   }
//   const userDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${storageUnit}`)
//   const snapshot = await getDoc(userDoc)
//   if (snapshot.exists()) {
//     const docData = snapshot.data()
//     const dict = { ...docData.meals }
//     for (const key in dict) {
//       if (dict.hasOwnProperty(key)) {
//         if (!mealsArr.find((obj) => obj.id == key)) {
//           mealsArr.push({
//             id: key,
//             name: dict[key].name,
//             description: dict[key].description,
//             image: require("../../../assets/images/dummyMealImages/chickenandrice.jpg"),
//             ingredients: dict[key].ingredients,
//             ...(storageUnit == "fridge1" ? { numInFridge: dict[key].servings } : { numInFreezer: dict[key].servings }),
//           } as Meal)
//         } else {
//           const meal: any = mealsArr.find((obj) => obj.id == key)
//           storageUnit == "fridge1" ? (meal.numInFridge = dict[key].servings) : (meal.numInFreezer = dict[key].servings)
//         }
//       }
//     }
//   }
// }

export default function MoveMealsScreen() {
  const [activeTab, setActiveTab] = useState("fridge")
  const [loading, setLoading] = useState(true)
  const [selectedMeals, setSelectedMeals] = useState<string[]>([])
  const [allMeals, setAllMeals] = useState<Meal[]>([])
  const [meals, setMeals] = useState<Meal[]>([])

  // Load meals from AsyncStorage
  const loadMealsFromStorage = async () => {
    try {
      const storedMealsJson = await AsyncStorage.getItem('dummyMeals')
      
      if (storedMealsJson) {
        const storedMeals = JSON.parse(storedMealsJson)
        console.log('Loaded meals from storage:', storedMeals)
        return storedMeals
      } else {
        console.log('No meals found in storage')
        return []
      }
    } catch (error) {
      console.error('Error loading meals from storage:', error)
      return []
    }
  }

  // Save meals to AsyncStorage
  const saveMealsToStorage = async (meals: Meal[]) => {
    try {
      await AsyncStorage.setItem('dummyMeals', JSON.stringify(meals))
      console.log('Meals saved to storage successfully')
    } catch (error) {
      console.error('Error saving meals to storage:', error)
    }
  }

  function switchTab(tab: string) {
    let filteredMeals: Meal[] = []
    
    if (tab === "fridge") {
      filteredMeals = allMeals.filter(meal => meal.numInFridge && meal.numInFridge > 0)
    } else if (tab === "freezer") {
      filteredMeals = allMeals.filter(meal => meal.numInFreezer && meal.numInFreezer > 0)
    }
    
    setMeals(filteredMeals)
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

    // Create a copy of all meals
    const updatedMeals = [...allMeals]
    
    // Update the selected meals
    selectedMeals.forEach(mealId => {
      const mealIndex = updatedMeals.findIndex(meal => meal.id === mealId)
      
      if (mealIndex !== -1) {
        const meal = updatedMeals[mealIndex]
        
        if (activeTab === "fridge") {
          // Moving from fridge to freezer
          const servingsToMove = meal.numInFridge || 0
          updatedMeals[mealIndex] = {
            ...meal,
            numInFridge: 0,
            numInFreezer: (meal.numInFreezer || 0) + servingsToMove
          }
        } else {
          // Moving from freezer to fridge
          const servingsToMove = meal.numInFreezer || 0
          updatedMeals[mealIndex] = {
            ...meal,
            numInFreezer: 0,
            numInFridge: (meal.numInFridge || 0) + servingsToMove
          }
        }
      }
    })
    
    // Save updated meals to storage
    await saveMealsToStorage(updatedMeals)
    
    // Update state
    setAllMeals(updatedMeals)
    
    // Show success message
    Alert.alert(
      "Meals Moved", 
      `Successfully moved ${selectedMeals.length} meals from ${activeTab} to ${activeTab === "fridge" ? "freezer" : "fridge"}.`,
      [
        { 
          text: "OK", 
          onPress: () => {
            // Reset selection and refresh the list
            setSelectedMeals([])
            switchTab(activeTab)
          } 
        }
      ]
    )
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
        const storedMeals = await loadMealsFromStorage()
        setAllMeals(storedMeals)
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

      {/* Header Section */}
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
        {/* Tabs */}
        <View style={styles.tabContainer}>
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

        {/* Selected count */}
        <View style={styles.selectionInfo}>
          <Text style={styles.selectionText}>{selectedMeals.length} meals selected</Text>
        </View>

        {/* Meal List */}
        <FlatList
          data={meals}
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 16,
    color: Colors.textTertiary,
  },
  activeTabText: {
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  selectionInfo: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  selectionText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "500",
  },
  mealListContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  mealItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 12,
    padding: 12,
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
    fontWeight: "500",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  mealDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealDetailText: {
    fontSize: 14,
    color: Colors.textTertiary,
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

