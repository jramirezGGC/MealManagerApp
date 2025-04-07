import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import Colors from '@/src/constants/Colors';
import MealContainer from '@/src/components/MealContainer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/src/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { router, useRouter } from "expo-router"
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons"
import { Meal } from "@/src/types";



const getHouseholdID = async () => {
  const userID = FIREBASE_AUTH.currentUser?.uid
  const userDoc = doc(FIREBASE_DB, `users/${userID}`);
  const snapshot = await getDoc(userDoc);
  let householdID
  
  if (snapshot.exists()) {
    const docData = snapshot.data();
    console.log(`Data: ${JSON.stringify(docData)}`);
    householdID = docData.householdID
  }
  else {
    console.log("IT Broke")
  }

  try {
    await AsyncStorage.setItem("householdID", householdID)
  } catch (error) {
    console.error("Async Storage could not set householdID", error);
  }
}

const meals: Meal[] = [
  {
    id: "1", name: "Chicken Pasta", description: "Lunch",
    image: null,
    calories: 0,
    date: null,
    ingredients: [],
    numInFridge: 0,
    numInFreezer: 0
  },
  {
    id: "2", name: "Avocado Toast", description: "Breakfast",
    image: null,
    calories: 0,
    date: null,
    ingredients: [],
    numInFridge: 0,
    numInFreezer: 0
  },
  {
    id: "3", name: "Vegetable Stir Fry", description: "Dinner",
    image: null,
    calories: 0,
    date: null,
    ingredients: [],
    numInFridge: 0,
    numInFreezer: 0
  },
  {
    id: "4", name: "Greek Yogurt", description: "Breakfast",
    image: null,
    calories: 0,
    date: null,
    ingredients: [],
    numInFridge: 0,
    numInFreezer: 0
  },
  {
    id: "5", name: "Salmon with Rice", description: "Dinner",
    image: null,
    calories: 0,
    date: null,
    ingredients: [],
    numInFridge: 0,
    numInFreezer: 0
  },
  {
    id: "6", name: "Caesar Salad", description: "Lunch",
    image: null,
    calories: 0,
    date: null,
    ingredients: [],
    numInFridge: 0,
    numInFreezer: 0
  },
  {
    id: "7", name: "Fruit Smoothie", description: "Breakfast",
    image: null,
    calories: 0,
    date: null,
    ingredients: [],
    numInFridge: 0,
    numInFreezer: 0
  },
  {
    id: "8", name: "Beef Stew", description: "Dinner",
    image: null,
    calories: 0,
    date: null,
    ingredients: [],
    numInFridge: 0,
    numInFreezer: 0
  },
  {
    id: "9", name: "Quinoa Bowl", description: "Lunch",
    image: null,
    calories: 0,
    date: null,
    ingredients: [],
    numInFridge: 0,
    numInFreezer: 0
  },
];

export default function MainDashboard() {

  getHouseholdID()

  // Mock data - replace with actual data from your state management
  const mealCounts = {
    fridge: 8,
    freezer: 14,
  }

  const router = useRouter();
  // Navigation options
  const navigationOptions = [
    {
      id: "inventory",
      title: "Inventory",
      description: "Manage your food items",
      icon: <Feather name="package" size={32} color={Colors.white} />,
      route: "/(user)/Inventory",
      color: Colors.primary,
    },
    {
      id: "mealManager",
      title: "Manage Refrigerator",
      description: "Edit meals",
      icon: <MaterialIcons name="restaurant-menu" size={32} color={Colors.white} />,
      route: "/(user)/Fridge",
      color: "#4CAF50", // Green color
    },
    {
      id: "savedMeals",
      title: "Saved Meals",
      description: "View meal history",
      icon: <Ionicons name="time" size={32} color={Colors.white} />,
      route: "/(user)/SavedMeals",
      color: "#FF9800", // Orange color
    },
  ]

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome Back</Text>
        </View>
        <Text style={styles.headerSubtitle}>Your meal dashboard</Text>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        {/* Stats Container - Updated to show Fridge and Freezer counts */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mealCounts.fridge}</Text>
            <Text style={styles.statLabel}>Fridge Meals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{mealCounts.freezer}</Text>
            <Text style={styles.statLabel}>Freezer Meals</Text>
          </View>
        </View>

        {/* Navigation Cards */}
        <View style={styles.navigationContainer}>
          {navigationOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.navigationCard, { backgroundColor: option.color }]}
              onPress={() => router.push(option.route as any)}
            >
              <View style={styles.navigationIconContainer}>{option.icon}</View>
              <View style={styles.navigationTextContainer}>
                <Text style={styles.navigationTitle}>{option.title}</Text>
                <Text style={styles.navigationDescription}>{option.description}</Text>
              </View>
              <View style={styles.navigationArrow}>
                <Text style={styles.navigationArrowText}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        
        <MealContainer meals={meals}/>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    paddingBottom: 80, // Add padding for bottom nav
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
  navigationContainer: {
    paddingHorizontal: 24,
  },
  navigationCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigationIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  navigationTextContainer: {
    flex: 1,
  },
  navigationTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 4,
  },
  navigationDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  navigationArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  navigationArrowText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.white,
  },
});