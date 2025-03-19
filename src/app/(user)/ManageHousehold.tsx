import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, ScrollView } from "react-native"
import { StatusBar } from "expo-status-bar"
import { router } from "expo-router"
import Colors from '@/src/constants/Colors';

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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Household</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImage} />
          <Text style={styles.username}>Username</Text>
          <Text style={styles.role}>Fridge Owner</Text>
        </View>

        {/* Members List */}
        <View style={styles.membersContainer}>
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
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Member Button */}
        <TouchableOpacity style={styles.addButton} /*onPress={handleAddMember}*/>
          <Text style={styles.addButtonText}>ADD NEW MEMBER</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 12,
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: Colors.textTertiary,
  },
  membersContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 24,
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
  chevron: {
    color: Colors.white,
    fontSize: 24,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
})
