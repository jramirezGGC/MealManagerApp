import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import Colors from '@/src/constants/Colors';
import MealContainer from '@/src/components/MealContainer';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/src/lib/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";


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

export default function MainDashboard() {

  getHouseholdID()

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
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Total Meals</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>5</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
        </View>

        <MealContainer />
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/Fridge")}>
          <Text style={styles.navIcon}>🗄️</Text>
          <Text style={styles.navText}>Fridge</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addButton} onPress={() => router.push("/(user)/CreateMeal")}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navButton} onPress={() => router.push("/(user)/Settings")}>
          <Text style={styles.navIcon}>⚙️</Text>
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
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
  bottomNav: {
    flexDirection: "row",
    backgroundColor: Colors.background,
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
});