import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"

export default function PersonalInfoScreen() {
  const userInfo = {
    username: "Username",
    email: "email@email.com",
  }

  // const handleEdit = () => {
  //   router.push("/edit-profile")
  // }

  // const handleLogout = () => {
  //   // Add your logout logic here
  //   router.replace("/login")
  // }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Info</Text>
        </View>
        <TouchableOpacity /*onPress={handleEdit}*/>
          <Text style={styles.editButton}>EDIT</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImage} />
        <Text style={styles.username}>{userInfo.username}</Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Text>👤</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>FULL NAME</Text>
            <Text style={styles.infoValue}>{userInfo.username}</Text>
          </View>
        </View>

        <View style={styles.infoItem}>
          <View style={styles.infoIcon}>
            <Text>✉️</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>EMAIL</Text>
            <Text style={styles.infoValue}>{userInfo.email}</Text>
          </View>
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} /*onPress={handleLogout}*/>
        <Text style={styles.logoutButtonText}>LOGOUT</Text>
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
    justifyContent: "space-between",
    padding: 16,
    paddingTop: Platform.OS === "android" ? 16 : 0,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
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
  editButton: {
    color: "#74af44",
    fontSize: 16,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#4e752d",
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#32343e",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    gap: 24,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: "#6b6e82",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: "#32343e",
  },
  logoutButton: {
    backgroundColor: "#4e752d",
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: "auto",
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
