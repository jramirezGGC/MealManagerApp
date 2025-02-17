import React from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Pressable, Platform } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons'; //again placeholder.

export default function ManageHouseholdScreen(){
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            {/* Back Button */}
            <Pressable style={styles.goBackButton} onPress={() => { /* Navigation logic here */ }}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>

            {/* Title: Centered with compatibility */}
            <View style={styles.titleContainer}>
              <Text style={styles.dashboardTitle}>Manage Household</Text>
            </View>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImage} />
            <View>
              <Text style={styles.username}>@Username</Text>
              <Text style={styles.roleText}>Fridge Owner</Text>
            </View>
          </View>

          {/* Household Members Section */}
          <View style={styles.householdContainer}>
            <Text style={styles.sectionTitle}>Household Members (3)</Text>

            {/* Placeholder Household Members */}
            <Pressable style={styles.memberButton} onPress={() => { /* Navigate to member details */ }}>
              <FontAwesome name="user-circle" size={24} color="black" style={styles.memberIcon} />
              <Text style={styles.memberText}>Household Member 1</Text>
              <AntDesign name="right" size={20} color="black" />
            </Pressable>

            <Pressable style={styles.memberButton} onPress={() => { /* Navigate to member details */ }}>
              <FontAwesome name="user-circle" size={24} color="black" style={styles.memberIcon} />
              <Text style={styles.memberText}>Household Member 2</Text>
              <AntDesign name="right" size={20} color="black" />
            </Pressable>

            <Pressable style={styles.memberButton} onPress={() => { /* Navigate to member details */ }}>
              <FontAwesome name="user-circle" size={24} color="black" style={styles.memberIcon} />
              <Text style={styles.memberText}>Household Member 3</Text>
              <AntDesign name="right" size={20} color="black" />
            </Pressable>
          </View>

          {/* Add New Member Button */}
          <Pressable style={styles.addMemberButton} onPress={() => { /* Add member logic */ }}>
            <Text style={styles.addMemberText}>Add New Member</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Ensures the back button stays on the left
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10,
    paddingBottom: 15,
  },
  goBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1, // Makes the title container take available space
    justifyContent: 'center', // Vertically centers the title
    alignItems: 'center', // Horizontally centers the title
    marginTop: Platform.OS === 'android' ? 0 : 10, // Adjust title spacing based on the platform
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center', // Ensures title is centered
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#d9d9d9',
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  roleText: {
    fontSize: 14,
    color: 'gray',
    marginLeft: 15,
  },
  householdContainer: {
    marginTop: 30,
    paddingHorizontal: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  memberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  memberIcon: {
    marginRight: 10,
  },
  memberText: {
    flex: 1,
    fontSize: 16,
  },
  addMemberButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
  },
  addMemberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

