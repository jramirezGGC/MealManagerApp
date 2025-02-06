import React from 'react';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, Pressable, Image, Platform } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            {/* Back Button + Title */}
            <Pressable style={styles.goBackButton} onPress={() => { /* Navigation logic here */ }}>
              <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>
            <Text style={styles.dashboardTitle}>Main Dashboard</Text>

            {/* Edit Button */}
            <Pressable style={styles.editButton} onPress={() => { /* Edit Profile Logic */ }}>
              <Text style={styles.editText}>EDIT</Text>
            </Pressable>
          </View>

          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.profileImage} />
            <Text style={styles.username}>@Username</Text>
          </View>

          {/* User Info */}
          <View style={styles.infoContainer}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.info}>John Doe</Text>

            <Text style={styles.label}>Email</Text>
            <Text style={styles.info}>johndoe@example.com</Text>
          </View>

          {/* Logout Button */}
          <Pressable style={styles.logoutButton} onPress={() => { /* Logout Logic */ }}>
            <Text style={styles.logoutText}>Logout</Text>
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
    justifyContent: 'space-between',
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
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 5,
  },
  editText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
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
  infoContainer: {
    marginTop: 30,
    paddingHorizontal: 40,
  },
  label: {
    fontSize: 16,
    color: 'gray',
    marginTop: 15,
  },
  info: {
    fontSize: 18,
    fontWeight: '500',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center', // Ensures proper centering
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: Platform.OS === 'android' ? 160 : 'auto', // Adjust width on Android if needed
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center', // Ensures text is centered inside the button
  },
});

export default ProfileScreen;
