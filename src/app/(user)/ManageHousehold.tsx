import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, ScrollView } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import Colors from "@/src/constants/Colors"

export default function ManageHouseholdScreen() {
  const members = [
    { id: 1, name: "Household Member 1" },
    { id: 2, name: "Household Member 2" },
    { id: 3, name: "Household Member 3" },
  ]

  // const handleMemberPress = (memberId: number) => {
  //   router.push(`/member/${memberId}`)
  // }

  // const handleAddMember = () => {
  //   router.push("/add-member")
  // }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Manage Household</Text>
            <Text style={styles.headerSubtitle}>Manage your household members</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Text style={styles.profileInitial}>U</Text>
            </View>
            <Text style={styles.username}>Username</Text>
            <Text style={styles.role}>Fridge Owner</Text>
          </View>

          {/* Members List */}
          <View style={styles.membersContainer}>
            <Text style={styles.sectionTitle}>Household Members</Text>
            <View style={styles.membersList}>
              {members.map((member) => (
                <TouchableOpacity
                  key={member.id}
                  style={[styles.memberItem, member.id !== members.length && styles.memberItemBorder]}
                  /*onPress={() => handleMemberPress(member.id)}*/
                >
                  <View style={styles.memberContent}>
                    <View style={styles.memberAvatar}>
                      <Text style={styles.avatarIcon}>👤</Text>
                    </View>
                    <Text style={styles.memberName}>{member.name}</Text>
                  </View>
                  <View style={styles.chevronContainer}>
                    <Text style={styles.chevron}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        {/* Add Member Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.addButton} /*onPress={handleAddMember}*/>
            <Text style={styles.addButtonText}>Add New Member</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: "center",
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
  headerSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 24,
    paddingBottom: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.divider,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInitial: {
    fontSize: 48,
    fontWeight: "600",
    color: Colors.primary,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: Colors.textSecondary,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 16,
    paddingHorizontal: 24,
  },
  membersContainer: {
    marginBottom: 24,
  },
  membersList: {
    backgroundColor: Colors.secondary,
    marginHorizontal: 24,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  memberItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  memberContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarIcon: {
    fontSize: 20,
  },
  memberName: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: "500",
  },
  chevronContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  chevron: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "600",
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    bottom: 20,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
})
