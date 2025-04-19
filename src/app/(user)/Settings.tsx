import { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Image,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import Colors from "@/src/constants/Colors";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const defaultProfileImage = require("../../../assets/images/silly-youtube-emotes.png")
const auth = getAuth();

export default function SettingsScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          try {
            const db = getFirestore();
            const userDocRef = doc(db, "users", currentUser.uid);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              if (userData.name) {
                setUserName(userData.name);
              }
            }
          } catch (error) {
            console.error("Error fetching Firestore user name:", error);
          }
        }
      });

      return unsubscribe;
    };

    fetchUserData();
  }, []);

  const navigationItems = [
    {
      id: 1,
      title: "Account Settings",
      icon: "👤",
      onPress: () => router.push("/(user)/Profile"),
    },
    {
      id: 2,
      title: "Manage Household",
      icon: "🏠",
      onPress: () => router.push("/(user)/ManageHousehold"),
    }
  ];

  const handleLogout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.clear();
      router.replace(`/(auth)/sign-in`);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            // source={defaultProfileImage}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.userName}>{userName || "No name available"}</Text>
        <Text style={styles.userEmail}>{user?.email || "No email available"}</Text>
      </View>

      {/* Navigation Section */}
      <View style={styles.contentContainer}>
        <View style={styles.navigationContainer}>
          {navigationItems.map((item) => (
            <TouchableOpacity key={item.id} style={styles.navigationItem} onPress={item.onPress}>
              <View style={styles.navigationIconContainer}>
                <Text style={styles.navigationIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.navigationTitle}>{item.title}</Text>
              <Text style={styles.navigationArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
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
    marginBottom: 4,
  },
  profileSection: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 30,
    paddingHorizontal: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  navigationContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 30,
  },
  navigationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  navigationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  navigationIcon: {
    fontSize: 20,
  },
  navigationTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: Colors.white,
  },
  navigationArrow: {
    fontSize: 24,
    color: Colors.white,
  },
  logoutButton: {
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
  logoutButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
