import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router, useLocalSearchParams } from "expo-router"
import Colors from "@/src/constants/Colors"
import type { Meal } from "@/src/types"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { FIREBASE_DB } from "@/src/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";


// let mealsArr: Meal[] = [];
// let meals: Meal[] = [];

// async function loadStuff(storageUnit: string) {
//   let householdID
//   try {
//     householdID = await AsyncStorage.getItem("householdID");
//   } catch (error) {
//     console.error("Async Storage could not get householdID", error);
//   }
//   const userDoc = doc(FIREBASE_DB, `households/${householdID}/inventory/${storageUnit}`);
//   const snapshot = await getDoc(userDoc);
//   if (snapshot.exists()) {
//     const docData = snapshot.data();
//     const dict = { ...docData.meals }
//     for (const key in dict) {
//       if (dict.hasOwnProperty(key)) {
//         if (!mealsArr.find(obj => obj.id == key)) {
//           mealsArr.push({
//             id: key,
//             name: dict[key].name,
//             description: dict[key].description,
//             image: require("../../../assets/images/dummyMealImages/chickenandrice.jpg"),
//             ingredients: dict[key].ingredients,
//             ...(storageUnit == "fridge1"
//               ? { numInFridge: dict[key].servings }
//               : { numInFreezer: dict[key].servings })
//           } as Meal);
//         }
//         else {
//           let meal: any = mealsArr.find(obj => obj.id == key);
//           storageUnit == "fridge1" ? meal.numInFridge = dict[key].servings : meal.numInFreezer = dict[key].servings
//         }
//       }
//     }

//     console.log(`Data: ${JSON.stringify(mealsArr)}`);
//   }
//   else {
//     console.error("Gallery Meals loading unsuccessful")
//   }
// }

// Initial dummy meals (will be overridden by AsyncStorage)
const initialDummyMeals: Meal[] = [
  {
    id: "1001",
    name: "Chicken Pasta",
    description: "Delicious pasta with chicken",
    image: Colors.imagePlaceholder,
    ingredients: [
      { name: "Pasta", amount: "400g", calories: 450 },
      { name: "Chicken", amount: "400g", calories: 450 },
      { name: "Sauce", amount: "400g", calories: 5 }
    ],
    numInFridge: 2,
    numInFreezer: 0,
    date: "2023-04-15",
    calories: 450
  },
  {
    id: "1002",
    name: "Beef Stir Fry",
    description: "Quick and easy stir fry",
    image: Colors.imagePlaceholder,
    ingredients: [
      { name: "Beef", amount: "200g", calories: 200},
      { name: "Vegetables", amount: "300g", calories: 300},
      { name: "Soy Sauce", amount: "30ml", calories: 30}
    ],
    numInFridge: 0,
    numInFreezer: 3,
    date: "2023-04-10",
    calories: 380
  }
];

export default function RefrigeratorScreen() {
  // Rest of the code remains the same
  const params = useLocalSearchParams()
  const [activeTab, setActiveTab] = useState("fridge")
  const [loading, setLoading] = useState(true)
  const [recentMealId, setRecentMealId] = useState<string | null>(null)
  const [showRecentHighlight, setShowRecentHighlight] = useState(false)
  const [meals, setMeals] = useState<Meal[]>([])
  const [allMeals, setAllMeals] = useState<Meal[]>([])

  // Load meals from AsyncStorage
  const loadMealsFromStorage = async () => {
    try {
      const storedMealsJson = await AsyncStorage.getItem('dummyMeals')
      
      if (storedMealsJson) {
        const storedMeals = JSON.parse(storedMealsJson)
        console.log('Loaded meals from storage:', storedMeals)
        return storedMeals
      } else {
        // If no meals in storage yet, use initial dummy meals and save them
        await AsyncStorage.setItem('dummyMeals', JSON.stringify(initialDummyMeals))
        return initialDummyMeals
      }
    } catch (error) {
      console.error('Error loading meals from storage:', error)
      return initialDummyMeals
    }
  }

  // Function to filter meals based on active tab
  function switchTab(tab: string) {
    let filteredMeals: Meal[] = []
    
    if (tab === "fridge") {
      filteredMeals = allMeals.filter(meal => meal.numInFridge && meal.numInFridge > 0)
    } else if (tab === "freezer") {
      filteredMeals = allMeals.filter(meal => meal.numInFreezer && meal.numInFreezer > 0)
    }
    
    setMeals(filteredMeals)
    setActiveTab(tab)
  }

  const renderMealItem = ({ item }: { item: Meal }) => (
    <View style={[
      styles.mealItem, 
      showRecentHighlight && item.id === recentMealId && styles.recentMealItem
    ]}>
      <View style={styles.mealContent}>
        <View style={styles.mealImage} />
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{item.name}</Text>
          <View style={styles.mealDetails}>
            <Text style={styles.mealDetailText}>
              {activeTab === "fridge" 
                ? `${item.numInFridge} servings` 
                : `${item.numInFreezer} servings`}
            </Text>
            {showRecentHighlight && item.id === recentMealId && (
              <>
                <Text style={styles.mealDetailSeparator}>|</Text>
                <Text style={styles.newMealTag}>New</Text>
              </>
            )}
          </View>
        </View>
        <Text style={styles.mealNumber}>#{item.id}</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEditMeal(item)}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>
  )

  const handleEditMeal = (meal: Meal) => {
    // Add your edit meal logic here
    console.log("Edit meal:", meal.id)
    // router.push(`/(user)/EditMeal?id=${meal.id}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load meals from AsyncStorage
        const storedMeals = await loadMealsFromStorage()
        setAllMeals(storedMeals)
        
        // Check if we have a recent meal to highlight
        if (params.recentMealId && params.showRecent === "true") {
          setRecentMealId(params.recentMealId as string)
          setShowRecentHighlight(true)
          
          // Switch to the tab where the meal was added
          if (params.storageLocation) {
            const tabToShow = params.storageLocation as string
            setActiveTab(tabToShow)
            
            // Filter meals for the active tab
            if (tabToShow === "fridge") {
              setMeals(storedMeals.filter((meal: Meal) => meal.numInFridge && meal.numInFridge > 0))
            } else {
              setMeals(storedMeals.filter((meal: Meal) => meal.numInFreezer && meal.numInFreezer > 0))
            }
          } else {
            // Default to fridge
            setActiveTab("fridge")
            setMeals(storedMeals.filter((meal: Meal) => meal.numInFridge && meal.numInFridge > 0))
          }
          
          // Clear the highlight after 3 seconds
          setTimeout(() => {
            setShowRecentHighlight(false)
          }, 3000)
        } else {
          // Default to fridge tab
          setActiveTab("fridge")
          setMeals(storedMeals.filter((meal: Meal) => meal.numInFridge && meal.numInFridge > 0))
        }
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.recentMealId, params.showRecent, params.storageLocation])

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
          <Text style={styles.headerTitle}>Refrigerator</Text>
        </View>
        <Text style={styles.headerSubtitle}>Manage your meals</Text>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Stats Container */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{meals.length}</Text>
            <Text style={styles.statLabel}>Total Meals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{activeTab === "fridge" ? "Fridge" : "Freezer"}</Text>
            <Text style={styles.statLabel}>Current View</Text>
          </View>
        </View>

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

        {/* Meal List */}
        <FlatList
          data={meals}
          renderItem={renderMealItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.mealListContent}
          ListHeaderComponent={() => <Text style={styles.sectionTitle}>List of Meals:</Text>}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No meals found in {activeTab}</Text>
            </View>
          )}
        />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/MainDashboard")}>
          <Text style={styles.navIcon}>🏠</Text>
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(user)/CreateMeal")}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/MoveMeals")}>
          <Text style={styles.navIcon}>🔄</Text>
          <Text style={styles.navText}>Move Meals</Text>
        </TouchableOpacity>
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
    paddingTop: Platform.OS === "android" ? 16 : 0,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    fontSize: 20,
    color: Colors.white,
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
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 24,
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.textTertiary,
    opacity: 0.3,
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
  mealListContent: {
    paddingHorizontal: 24,
    paddingBottom: 100, // Add padding to account for bottom nav
  },
  sectionTitle: {
    fontSize: 16,
    color: Colors.textTertiary,
    marginBottom: 16,
  },
  mealItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: 16,
  },
  recentMealItem: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "rgba(0, 128, 0, 0.05)",
    padding: 12,
    marginBottom: 16,
  },
  mealContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
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
  mealDetailSeparator: {
    marginHorizontal: 8,
    color: Colors.textTertiary,
  },
  newMealTag: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  mealNumber: {
    fontSize: 14,
    color: Colors.textTertiary,
    marginLeft: 12,
  },
  editButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "flex-end",
  },
  editButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "500",
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
  bottomNav: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  navButton: {
    alignItems: "center",
    width: 80,
  },
  navIcon: {
    fontSize: 24,
    color: Colors.primary,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: Colors.primary,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20,
  },
  addButtonText: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: "300",
  },
})